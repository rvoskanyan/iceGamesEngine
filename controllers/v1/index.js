import Order from "../../models/Order.js";
import Key from "../../models/Key.js";
import Product from "../../models/Product.js";
import {mailingBuyProduct, outStockProduct} from "../../services/mailer.js";
import metrica from "../../services/metrica.js";
import User from "../../models/User.js";
import { achievementEvent } from "../../services/achievement.js";


// /v1/webhook handler
export const yaSplitHandler = async (req, res) => {
  try {
    
    console.log('yaSplitHandler');
    console.log(req);
    
    const { operation } = req.body;
    const order = await Order.findById(operation.orderId);
    
    res.json({ "status": "success" });
    
    if (!order) {
      return res.status(400).json({
        "reason": "Order non found",
        "reasonCode": "404",
        "status": "fail"
      }); //Сделать логирование и уведомление, что пришло уведомление по не существующему заказу
    }
    
    if (operation.status === 'SUCCESS') {
      if (order.status === 'paid') {
        return;
      }
      
      const orderItems = order.items;
      
      for (const item of orderItems) {
        const productId = item.productId;
        const key = await Key.findOne({product: productId, isActive: true, isSold: false});
        const product = await Product.findById(productId).populate([{
          path: 'activationServiceId',
          select: 'name',
        }]);
        
        if (!key) {
          order.messages.push(`Не найден в наличии ключ активации для ${product.name}`); //Сделать уведомление в админке
          continue;
        }
        
        key.isSold = true;
        key.soldOrder = order._id;
        key.sellingPrice = item.sellingPrice;
        await key.save();
        
        product.countKeys--;
        
        if (product.isSaleStock) {
          product.isSaleStock = product.countKeys > 0;
        }
        
        await product.save();
        await product.changeInStock(product.countKeys > 0 || product.kupiKodInStock);
        
        await mailingBuyProduct({
          product,
          email: order.buyerEmail,
          key: key.value,
        });
        
        if (product.countKeys < 4 && !product.kupiKodInStock) {
          outStockProduct(product).then();
        }
      }
      
      const amount = order.items.reduce((amount, item) => amount + item.sellingPrice, 0);
      
      if (order.yaClientId) {
        metrica.offlineConversation(order.yaClientId, "payment_success", amount, "RUB").then()
      }
      
      order.status = 'paid';
      await order.save();
      
      if (order.userId) {
        const user = await User.findById(order.userId);
        
        if (user) {
          const countPurchases = orderItems.length;
          
          user.purchasedProducts += countPurchases;
          await user.save();
          await user.increaseRating(countPurchases * 10);
          await achievementEvent('productPurchase', user);
        }
      }
      
      return;
    }
    
    order.status = 'canceled';
    await order.save();
  } catch (e) {
    console.log(e);
  }
}
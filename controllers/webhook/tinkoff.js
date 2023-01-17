import {mailingBuyProduct} from "../../services/mailer.js";
import User from "../../models/User.js";
import Order from "../../models/Order.js";
import {achievementEvent} from "../../services/achievement.js";
import metrica from "../../services/metrica.js";
import Key from "../../models/Key.js";
import Product from "../../models/Product.js";

export default async function (req, res) {
    try {
        const {OrderId, Success, Status, Amount} = req.body;
        const order = await Order.findById(OrderId);
    
        res.send("OK");
    
        if (!order) {
            return res.status(404).json({err:true, messages:"Forbidden"}); //Сделать логирование и уведомление, что пришло уведомление по не существующему заказу
        }

        if (Success && Status === 'CONFIRMED') {
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
                await product.save();
                await product.changeInStock(product.countKeys > 0);
                
                await mailingBuyProduct({
                    product,
                    email: order.buyerEmail,
                    key: key.value,
                });
            }
            
            if (order.yaClientId) {
                metrica.offlineConversation(order.yaClientId, "payment_success", Amount / 100, "RUB").then()
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
        res.status(500).json({err: true, message: e});
    }
}
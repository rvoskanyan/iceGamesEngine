import {mailingBuyProduct} from "../../services/mailer.js";
import User from "../../models/User.js";
import Order from "../../models/Order.js";
import {achievementEvent} from "../../services/achievement.js";

export default async function (req, res) {
    try {
        const {OrderId, Success, Status} = req.body;
        const order = await Order.findById(OrderId);
    
        if (!order) {
            return res.status(404).json({err:true, messages:"Forbidden"});
        }
        
        if (Success && Status === 'CONFIRMED') {
            res.send("OK");
            
            if (order.status === 'paid') {
                return;
            }
            
            let products = order.products.filter(item => item.dbi);
            
            for (const product of products) {
                await mailingBuyProduct(product.productId, order.buyerEmail, true);
            }
            
            order.paidTypes.push('dbi');
            
            switch (order.paymentType) {
                case 'mixed': {
                    switch (order.status) {
                        case 'notPaid': {
                            order.status = 'partiallyPaid';
                            break;
                        }
                        case 'partiallyPaid': {
                            order.status = 'paid';
                            break;
                        }
                        case 'canceled': {
                            order.status = order.paidTypes.length > 1 ? 'paid' : 'partiallyPaid';
                            break;
                        }
                    }
    
                    break;
                }
                case 'dbi': {
                    order.status = 'paid'
                    break;
                }
            }
    
            if (order.userId) {
                const user = await User.findById(order.userId);
                
                if (user) {
                    const countPurchases = products.length;
                    
                    user.purchasedProducts += countPurchases;
                    await user.save();
                    await user.increaseRating(countPurchases * 10);
                    await achievementEvent('productPurchase', user);
                }
            }
            
            return await order.save();
        }
        
        order.status = 'canceled';
        await order.save();
        
        res.send("OK");
    } catch (e) {
        console.log(e);
        res.status(500).json({err: true, message: e});
    }
}
import PaymentModule from "../../models/PaymentModule.js";
import {mailingBuyProduct} from "../../services/mailer.js";
import User from "../../models/User.js";
import Guest from "../../models/Guest.js";

export default async function (req, res) {
    try {
        let {TerminalKey, OrderId, Success, Status, PaymentId, Amount} = req.body
        let order = await PaymentModule.paymentCheckout.findById(OrderId).exec()
        if (!order) {
            res.status(404).json({err:true, messages:"Forbidden"})
            return
        }
        let isGuest = order.isGuest
        let user, metadata;
         if (isGuest) user = order.user
        else user = await User.findById(order.user.id).exec()

        if (Status === 'CONFIRMED') {
            let products = order.products_id
            metadata = order.metadata
            metadata = JSON.parse(metadata)
            if (!isGuest) {
                user.purchasedProducts += products.length
                await user.save()
            }
            for (let product of products) {
                let key = await mailingBuyProduct(product, user.email, true)
                if (!metadata.keys) metadata.keys = []
                if (!key) {
                    metadata.keys.push({product: product, fail: 'Key empty'})
                    continue;
                }
                metadata.keys.push({product: product, id: key._id.toString()})
                key.user_bought = {
                    id: isGuest ? null : user._id.toString(),
                    email: user.email
                }
                 await key.save()
            }
            metadata = JSON.stringify(metadata)
        }
        if (Status !== 'REJECTED') {
            //Clear carts
            user = isGuest ? await Guest.findById(user.id).exec() : user
            let {cart} = await user.populate({
                path: 'cart',
                select: ['_id']
            })
            cart = cart.filter(a=>{
                return !order.products_id.includes(a._id.toString())
            })
            user.cart = cart
            user.save()
        }

        await PaymentModule.paymentHistory.create({
            reference: order._id,
            changeField: JSON.stringify({status:order.status, amount:order.amount, metadata}),
            date_create: Date.now()
        })
        order.status = Status
        order.save()
        res.send("OK")
    } catch (e) {
        console.log(e)
       res.status(500).json({err:true, message: e})
    }
}
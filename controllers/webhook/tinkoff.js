import PaymentModule from "../../models/PaymentModule.js";
import {mailingBuyProduct} from "../../services/mailer.js";

export default async function (req, res) {
    try {
        let {TerminalKey, OrderId, Success, Status, PaymentId, Amount} = req.body
        let order = await PaymentModule.paymentCheckout.findById(OrderId).exec()
        if (!order) {
            res.status(404).json({err:true, messages:"Forbidden"})
            return
        }
        let {user} = await order.populate({
            path: 'user',
            select: ['email', 'cart']
        })
        if (Status === 'CONFIRMED') {
            let products = order.products_id
            for (let product of products) {
                await mailingBuyProduct(product, user.email, true)
            }
        }
        if (Status !== 'REJECTED') {
            //Clear carts
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
            changeField: JSON.stringify({status:order.status, amount:order.amount}),
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
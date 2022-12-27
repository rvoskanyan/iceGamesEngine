import PaymentModule from "../../models/PaymentModule.js";
import paymentModule from "../../models/PaymentModule.js";
import Product from "../../models/Product.js";
import mongoose from "mongoose";
import fetch from "node-fetch";

class Tinkoff {
    #_options = {
        debug: true,
        dev_url: "https://rest-api-test.tinkoff.ru/v2",
        prod_url: "https://securepay.tinkoff.ru/v2",
        urls: {
            init: '/Init/'
        },
        currency: {
            RUB: 643
        }
    }
    #_terminalKey = null; // terminalKey - This a secretToken
    #_password = null; // password - This a privateToken

    constructor(terminalKey, password, debug = true) {
        this.#_terminalKey = terminalKey
        this.#_password = password
        this.#_options.debug = debug
    }

    get_currency(currency) {
        return this.#_options.currency[currency] || this.#_options.currency.RUB
    }

    #_get_url(url) {
        let base = this.#_options.debug ? this.#_options.dev_url : this.#_options.prod_url
        return `${base}${this.#_options.urls[url]}`
    }

    async checkout(amount, orderId, token = undefined, currency = 'RUB', isTwo) {
        currency = this.get_currency(currency)
        let url = this.#_get_url('init')
        let get_success = isTwo ? 'https://icegames.store/cart?step=2&OrderId=${OrderId}' : undefined
        let res = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                TerminalKey: this.#_terminalKey,
                Currency: currency,
                Amount: amount*100,
                OrderId: orderId.toString(),
                Token: token,
                SuccessURL: get_success,
                NotificationURL: "https://icegames.store/webhook/v1/tinkoff"
            })
        })
        let data = await res.json()
        if (data.Success) {
            let {orderId, PaymentId, PaymentURL} = data
            return {PaymentURL, PaymentId, orderId}
        } else {
            console.log(data)
        }
        /*
        * {
           "Success" : true, //success or false = error
           "ErrorCode" : "0", // success
           "TerminalKey" : "TinkoffBankTest",
           "Status" : "NEW",
           "PaymentId": "13660", // session for payment
           "OrderId" : "21050", // our order Id
           "Amount" : 100000, // amount
           "PaymentURL" : "https://securepay.tinkoff.ru/rest/Authorize/1B63Y1" //checkout url
         }
        * */
    }
}

let createCheckouts = {
    async tinkoff(method, products_id, amount, currency, user, isGuest, isTwo, email) {
        let pCheckout = await PaymentModule.paymentCheckout.create({
            method_id: method._id, status: 'Created', date_create: Date.now(),
            products_id, amount, currency, user: {
                email: user.email || email,
                id: user._id
            }, isGuest
        })
        let tinkoff = new Tinkoff(method.secretToken, method.privateToken, false)
        let checkout = await tinkoff.checkout(amount, pCheckout._id, method.webhookSecret, currency, isTwo)
        if (!checkout) return
        let {PaymentURL, PaymentId} = checkout
        // add history checkout
        pCheckout.status = 'Waiting'
        pCheckout.checkout_url = PaymentURL
        pCheckout.checkoutId = PaymentId
        pCheckout.metadata = JSON.stringify({paymentId: PaymentId, products_id, webhookSecret:method.webhookSecret, isTwo})
        pCheckout.save()
        return PaymentURL
    }
}

export default {
    async methods(req, res) {
        try {
            let methods = await PaymentModule.paymentMethod.find({is_active: true})
                .select(['name', '_id', 'icons']).exec()
            res.json({ok: true, data: methods})
        } catch (e) {
            res.json({
                err: true
            })
        }

    },
    async checkout(req, res) {
        try {
            let isGuest = !res.locals.isAuth
            let payment_method_id = req.params.methods
            let {products, currency, isTwo, email, clientId} = req.body
            currency = currency?.toUpperCase() || 'RUB'
            isTwo = !!isTwo
            if (!clientId) {
                throw "ClientId is required"
            }
            if (typeof products === 'string') {
                products = JSON.parse(products)
            } else if (typeof products === 'object' && !Array.isArray(products) && products.id) {
                products = [products.id]
            } else if (typeof products !== 'object') {
                throw 'The argument "products" type should be list or object but not ' + typeof products
            }
            let paymentMethod = await paymentModule.paymentMethod.findById(payment_method_id).exec()
            if (!paymentMethod) throw 'This payment method is not support'
            if (!email && isGuest) throw 'The email is required for guest'
            let user = res.locals.person
            products = products.map(function (el) {
                return mongoose.Types.ObjectId(el)
            })
            let amount = await Product.aggregate([
                {$match: {_id: {$in: products}}},
                {$group: {_id: null, total: {$sum: '$priceTo'}}}
            ]).exec().then(a => {
                let [answer] = a
                return answer.total || 0
            }).catch(a => {
                throw 'Products is not exist'
            })
            if (!(['RUB'].includes(currency))) throw 'This currency is not support'

            let actions = createCheckouts[paymentMethod.name]

            if (!actions) {
                console.error(paymentMethod.name, paymentMethod.id, 'Is not support')
                res.status(503).json({
                    err: true,
                    message: "This payment method is not support " + paymentMethod.name + 'id -> ' + paymentMethod.id
                })
                return;
            }
            if (isTwo) amount = amount - amount*0.05
            let checkout = await actions(paymentMethod, products, amount, currency, user, isGuest, isTwo, email)

            res.send({checkout, ok:true})
        } catch (e) {
            res.status(400).json({
                err: true,
                message: e
            })
        }
    },

    async checkPayment(req, res) {
        try {
            if (!res.locals.isAuth) throw "Forbidden"
            let {orderId} = req.body
            if (!orderId) throw "Key \"orderId\" is required"
            let order = await PaymentModule.paymentCheckout.findById(orderId).exec()
            if (!order) throw 'Not found'
            let metadata = JSON.parse(order.metadata)
            res.json({status: order.status, isTwo: metadata?.isTwo || false, game: order.products_id})
        } catch (e) {
            res.json({err:true, message: e})
        }
    }
}
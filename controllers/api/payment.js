import mongoose from "mongoose";

import Tinkoff from "../../services/Tinkoff.js";

import PaymentModule from "../../models/PaymentModule.js";
import paymentModule from "../../models/PaymentModule.js";
import Product from "../../models/Product.js";
import Order from "../../models/Order.js";

let createCheckouts = {
    async tinkoff({method, amount, currency, isTwo, orderId, receipt}) {
        const tinkoff = new Tinkoff(method.secretToken, method.privateToken, false);
        const checkout = await tinkoff.checkout(amount, orderId, method.webhookSecret, currency, isTwo, receipt)
        
        if (!checkout) {
            return;
        }
        
        let {PaymentURL, PaymentId} = checkout;
        
        return {PaymentURL, PaymentId};
    }
}

export default {
    async methods(req, res) {
        try {
            let method = await PaymentModule
              .paymentMethod
              .findOne({is_active: true})
              .select(['name', '_id', 'icons'])
              .lean();
            
            if (!method) {
                throw new Error('Payment method not found');
            }
            
            res.json({ok: true, data: method})
        } catch (e) {
            res.json({err: true})
        }

    },
    async checkout(req, res) {
        try {
            const person = res.locals.person;
            const isAuth = res.locals.isAuth;
            let {products, isTwo, email, currency} = req.body;
            let orderId = req.body.orderId;
    
            isTwo = !!isTwo;
            currency = currency || 'RUB';
            currency = currency.toUpperCase();
    
            if (!(['RUB'].includes(currency))) {
                throw new Error('This currency is not support');
            }
    
            if (!isAuth && !email) {
                throw new Error('The email is required for guest');
            }
    
            if (typeof products === 'string') {
                products = JSON.parse(products)
            } else if (typeof products === 'object' && !Array.isArray(products) && products.id) {
                products = [products.id]
            } else if (typeof products !== 'object') {
                throw 'The argument "products" type should be list or object but not ' + typeof products
            }
            
            if (!products.length) {
                throw new Error('No products');
            }
    
            let paymentMethod = await paymentModule.paymentMethod.findById(req.params.paymentMethodId).lean();
            
            if (!paymentMethod) {
                throw new Error('Payment method not found');
            }
    
            let actions = createCheckouts[paymentMethod.name];
    
            if (!actions) {
                return res.status(503).json({
                    err: true,
                    message: `Not found action for ${paymentMethod.name} id -> ${paymentMethod.id}`,
                })
            }
    
            products = products.map(function (el) {
                return mongoose.Types.ObjectId(el)
            })
            
            const order = new Order({
                paymentType: isTwo ? 'mixed' : 'dbi',
                paymentMethod: paymentMethod._id,
                buyerEmail: isAuth ? person.email : email,
                status: 'notPaid',
                products: [],
            });
            
            if (isAuth) {
                order.userId = person._id;
            }
    
            const receiptItems = [];
            let amount = 0;
    
            for (const productId of products) {
                const product = await Product.findById(productId).select(['name', 'priceTo']).lean();
                const orderProduct = {
                    productId,
                    dbi: true,
                };
                
                if (!product) {
                    continue;
                }
                
                let price = product.priceTo;
                
                price = isTwo ? Math.floor( price - price * 0.05) : price;
                amount += price;
                orderProduct.purchasePrice = price;
                order.products.push(orderProduct);
                receiptItems.push({
                    Name: product.name,
                    Quantity: 1,
                    Amount: price * 100,
                    Price: price * 100,
                    Tax: 'none',
                });
            }
    
            if (!order.products.length) {
                throw new Error('Products not found');
            }
            
            const receipt = {
                Email: order.buyerEmail,
                Taxation: 'usn_income',
                Items: receiptItems,
            }
            
            let checkout = await actions({method: paymentMethod, amount, currency, isTwo, orderId: order._id, receipt});
            
            if (!checkout) {
                return res.status(503).json({
                    err: true,
                    message: 'Failed to create payment',
                });
            }
            
            order.paymentUrl = checkout.PaymentURL;
            order.paymentId = checkout.PaymentId;
            
            await order.save();
    
            /*if (isTwo) {
                products = products.map(item => item.toString());
                const dsProducts = person.cart
                  .filter(item => !products.includes(item.toString()))
                  .map(item => ({productId: item}));
                
                order.products = [...order.products, ...dsProducts];
            }*/
    
            products = products.map(item => item.toString());
            
            person.cart = person.cart.filter(item => !products.includes(item.toString()));
            await person.save();
    
            res.send({
                data: {
                    paymentUrl: checkout.PaymentURL,
                    orderId: order._id,
                },
                ok: true
            });
        } catch (e) {
            console.log(e);
            
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
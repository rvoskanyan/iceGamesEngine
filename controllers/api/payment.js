import mongoose from "mongoose";

import Tinkoff from "../../services/Tinkoff.js";

import PaymentModule from "../../models/PaymentModule.js";
import Product from "../../models/Product.js";
import Order from "../../models/Order.js";
import fetch from "node-fetch";
import {startSyncKupiKod} from "../../services/parsing.js";
import Key from "../../models/Key.js";

let createCheckouts = {
    async tinkoff({method, amount, currency, isTwo, orderId, receipt}) {
        const tinkoff = new Tinkoff(method.secretToken, method.privateToken, false);
        const checkout = await tinkoff.checkout(amount, orderId, method.webhookSecret, currency, isTwo, receipt)

        if (!checkout) {
            return;
        }

        const {PaymentURL, PaymentId} = checkout;

        return {PaymentURL, PaymentId};
    }
}

export default {
    async getPaymentMethod(req, res) {
        try {
            let method = await PaymentModule
              .paymentMethod
              .findOne({isActive: true})
              .select(['name', 'icon'])
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
            const receiptItems = [];
            let amount = 0;
            let { products, isTwo, email, currency, yaClientId } = req.body;
            
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
            
            if (yaClientId) {
                person.yaClientIds.addToSet(yaClientId);
                await person.save()
            }
            
            const paymentMethod = await PaymentModule.paymentMethod.findById(req.params.paymentMethodId).lean();

            if (!paymentMethod) {
                throw new Error('Payment method not found');
            }

            const actions = createCheckouts[paymentMethod.name];

            if (!actions) {
                return res.status(503).json({
                    err: true,
                    message: `Not found action for ${paymentMethod.name} id -> ${paymentMethod.id}`,
                })
            }

            const order = new Order({
                paymentMethod: paymentMethod._id,
                buyerEmail: person.email || email,
                status: 'awaiting',
                isDBI: true,
                yaClientId: yaClientId ? yaClientId : undefined,
                userId: isAuth ? person._id : undefined,
            });
            
            let kupiKodProducts = await Product.find({_id: {$in: products}, kupiKodInStock: true, isSaleStock: false}).distinct('kupiKodId');
            
            if (kupiKodProducts.length) {
                kupiKodProducts = kupiKodProducts.map(item => ({
                    sku: item,
                    qtt: 1,
                }));
    
                try {
                    const response = await fetch(`https://partner.kupikod.com/api/partner/orders/${order._id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': 'Basic cGFydG5lcl9pY2VnYW1lOmFqY3o5X1NZVE5oWFdid0s=',
                        },
                        body: JSON.stringify(kupiKodProducts),
                    });
        
                    if (!response.ok) {
                        throw new Error('Create kupi-kod order error');
                    }
        
                    const responseGetOrder = await fetch(`https://partner.kupikod.com/api/partner/orders/${order._id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': 'Basic cGFydG5lcl9pY2VnYW1lOmFqY3o5X1NZVE5oWFdid0s=',
                        },
                    });
        
                    if (!responseGetOrder.ok) {
                        throw new Error('Create kupi-kod order error');
                    }
        
                    const result = await responseGetOrder.json();
        
                    for (const {sku, secret, price} of result) {
                        const product = await Product.findOne({kupiKodId: sku});
            
                        const keyObj = new Key({
                            value: secret,
                            purchasePrice: price,
                            product: product._id,
                            expired: undefined,
                            isActive: true,
                        });
            
                        await keyObj.save();
    
                        product.countKeys++;
                        await product.save();
                    }
                } catch (e) {
                    console.log(e);
        
                    let kupiKodProducts = await Product.find({_id: {$in: products}, kupiKodInStock: true, isSaleStock: false});
        
                    for (const kupiKodProduct of kupiKodProducts) {
                        kupiKodProduct.kupiKodInStock = false;
            
                        await kupiKodProduct.save();
                    }
        
                    startSyncKupiKod(req);
                    throw new Error('Create kupi-kod order error');
                }
            }
    
            products = products.map(item => mongoose.Types.ObjectId(item))

            for (const productId of products) {
                const product = await Product.findOne({_id: productId, active: true}).select(['name', 'priceTo']).lean();

                if (!product) {
                    continue;
                }

                let price = product.priceTo;

                amount += price;
                order.items.push({
                    productId,
                    sellingPrice: price,
                });
                receiptItems.push({
                    Name: product.name,
                    Quantity: 1,
                    Amount: price * 100,
                    Price: price * 100,
                    Tax: 'none',
                });
            }

            if (!order.items.length) {
                throw new Error('Products not found');
            }

            const receipt = {
                Email: order.buyerEmail,
                Taxation: 'usn_income',
                Items: receiptItems,
            }

            const checkout = await actions({method: paymentMethod, amount, currency, isTwo, orderId: order._id, receipt});

            if (!checkout) {
                return res.status(503).json({
                    err: true,
                    message: 'Failed to create payment',
                });
            }

            order.paymentUrl = checkout.PaymentURL;
            order.paymentId = checkout.PaymentId;
    
            products = products.map(item => item.toString());
            person.cart = person.cart.filter(item => !products.includes(item.toString()));
            
            await person.save();
            await order.save();

            res.send({
                data: {
                    paymentUrl: checkout.PaymentURL,
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
}
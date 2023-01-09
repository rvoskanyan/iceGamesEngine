import Key from "../../models/Key.js";
import Product from "../../models/Product.js";
import Order from "../../models/Order.js";

export const pageKeys = async (req, res) => {
    try {
        const productId = req.query.productId;
        const isActive = req.query.isActive;
        const page = +req.query.page || 1;
        const limit = 10;
        const skip = limit * (page - 1);
        const keyFilter = {};
        const products = await Product.find({countKeys: {$gt: 0}}).select(['name']).lean();
        
        const allOrders = await Order.find().sort({createdAt: -1});
    
        console.log(allOrders.length);
    
        for (const order of allOrders) {
            console.log(order);
            if (order.isDBI || order.isDBI === false) {
                continue;
            }
            
            if (order.dsCartId) {
                if (!order.products.length) {
                    const clone = await Order.findOne({dsCartId: order.dsCartId}).sort({createdAt: 1});
                    const hasClone = clone._id.toString() !== order._id.toString();
    
                    if (hasClone) {
                        order.products = clone.products.filter(item => !item.dbi);
                        order.isDBI = false;
                    }
                } else {
                    const clone = await Order.findOne({dsCartId: order.dsCartId}).sort({createdAt: -1});
                    const hasClone = clone._id.toString() !== order._id.toString();
                    const dbiProducts = order.products.filter(item => item.dbi);
    
                    if (hasClone) {
                        order.products = dbiProducts;
                        order.isDBI = true;
                        order.dsBuyerEmail = undefined;
                        order.dsCartId = undefined;
                    } else if (dbiProducts.length) {
                        const newOrder = new Order({
                            dsCartId: order.dsCartId,
                            isDBI: false,
                            dsBuyerEmail: order.dsBuyerEmail || order.buyerEmail,
                            userId: order.userId ? order.userId : undefined,
                            buyerEmail: order.buyerEmail || order.dsBuyerEmail,
                            items: order.products.filter(item => !item.dbi).map(item => ({
                                sellingPrice: item.purchasePrice,
                                productId: item.productId,
                            })),
                            status: 'paid',
                        });
    
                        await newOrder.save();
    
                        order.products = dbiProducts;
                        order.isDBI = true;
                        order.dsBuyerEmail = undefined;
                        order.dsCartId = undefined;
                    } else {
                        order.isDBI = false;
                    }
                }
            } else {
                const dbiProducts = order.products.filter(item => item.dbi);
                
                if (dbiProducts.length) {
                    const hasDs = dbiProducts.length !== order.products.length;
    
                    if (hasDs) {
                        const newOrder = new Order({
                            dsBuyerEmail: order.dsBuyerEmail || order.buyerEmail,
                            isDBI: false,
                            userId: order.userId ? order.userId : undefined,
                            buyerEmail: order.buyerEmail || order.dsBuyerEmail,
                            items: order.products.filter(item => !item.dbi).map(item => ({
                                sellingPrice: item.purchasePrice,
                                productId: item.productId,
                            })),
                            status: 'paid',
                        });
        
                        await newOrder.save();
        
                        order.products = dbiProducts;
                        order.dsBuyerEmail = undefined;
                        order.dsCartId = undefined;
                    }
    
                    order.isDBI = true;
                }
            }
    
            if (order.status === 'notPaid') {
                order.status = 'awaiting';
            }
    
            order.items = order.products.map(item => {
                return {
                    sellingPrice: item.purchasePrice ? item.purchasePrice : undefined,
                    productId: item.productId,
                }
            });
            
            order.products = undefined;
    
            console.log(order);
        
            await order.save();
        }
    
        if (productId && productId !== 'notSelected') {
            keyFilter.product = productId;
        }
    
        if (isActive === 'on') {
            keyFilter.isActive = true;
        }
    
        const countKeys = await Key.countDocuments(keyFilter);
        const isLast = skip + limit >= countKeys;
        const isFirst = skip === 0;
        const isSinglePage = countKeys <= limit;
        const keys = await Key.find(keyFilter).limit(limit).skip(skip).populate([{
            path: 'product',
            select: ['name'],
        }]).lean();
        
        res.render('listKeyAdminPage', {
            layout: 'admin',
            title: 'Список ключей',
            section: 'keys',
            addTitle: "Добавить ключ",
            products: products.map(product => ({...product, selected: keyFilter.product === product._id.toString()})),
            isActive: keyFilter.isActive,
            productId: keyFilter.product,
            prevPage: +page - 1,
            nextPage: +page + 1,
            keys,
            isLast,
            isFirst,
            isSinglePage,
        });
    } catch (e) {
        console.log(e);
        res.redirect('/admin');
    }
}

export const pageAddKey = async (req, res) => {
    try {
        const products = await Product.find().select(['name']).lean();

        res.render('addKey', {
            layout: 'admin',
            products,
        });
    } catch (e) {
        console.log(e);
        res.redirect('/admin/keys');
    }
}

export const addKey = async (req, res) => {
    let $exp;
    
    try {
        const {productId, is_active, expired, is_edit} = req.body;
        const purchasePrice = +req.body.purchasePrice;
        let keys = req.body.keys;
        let keyValue = req.body.key;
        
        if (typeof keyValue !== 'string' && typeof keys !== 'string') {
            throw new Error('Не правильный тип данных ключа');
        } else if (!keyValue && !keys) {
            throw new Error('Ключ обязательный аргумент');
        }
    
        if (expired) {
            const today = new Date();
            $exp = new Date(expired);
        
            if (today > $exp) {
                throw new Error('Срок ключа истек');
            }
        }
        
        const product = await Product.findById(productId);
        
        if (!product) {
            throw new Error('Данная игра не существует в базе');
        }
        
        if (!is_edit) {
            const regExp = new RegExp('\\s');
            
            keys = keys.trim().split(regExp).map(key => key.trim()).filter(key => key.length && typeof key === 'string');
            
            if (!keys.length) {
                throw new Error('Keys not found');
            }
            
            for (let key of keys) {
                const keyObj = new Key({
                    purchasePrice: purchasePrice || 0,
                    value: key,
                    product: productId,
                    isActive: is_active === 'on',
                    expired: $exp || undefined,
                });
                
                await keyObj.save();
            }
    
            product.countKeys = keys.length;
            await product.save();
            await product.changeInStock(true);
        } else {
            const key = await Key.findById(req.params.keyId);
            
            if (!key) {
                throw 'Error';
            }
            
            key.value = keyValue
            key.product = productId
            key.isActive = is_active === 'on'
            key.expired = expired || undefined
            key.purchasePrice = purchasePrice || 0;
            key.deactivationReason = is_active === 'on' ? undefined : req.body.deactivationReason || undefined;
            
            await key.save()
        }
        
        res.redirect('/admin/keys');
    } catch (e) {
        console.log(e);
        res.redirect('/admin/keys');
    }
}


export const editKeyPage = async (req, res) => {
    try {
        let key = await Key.findById(req.params.keyId).lean();
        
        if (!key) {
            return res.redirect('/admin/keys/add');
        }
        
        key.product = key.product.toString();
    
        let products = await Product.find().select(['name']).lean();
        let expired = new Date(key.expired)
        let format_num = m=> m < 10 ? `0${m}`:m
        let get_month = x => format_num(x.getMonth()+1);
        
        expired = `${expired.getFullYear()}-${get_month(expired)}-${format_num(expired.getDate())}`;
        products = products.map(product => ({...product, '_id': product._id.toString()}))
        
        res.render('addKey', {
            layout: 'admin',
            products,
            key,
            expired,
            is_edit: true,
        });
    } catch (e) {
        console.log(e)
        res.redirect('/admin/keys/')
    }
}
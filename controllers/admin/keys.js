import Key from "../../models/Key.js";
import Product from "../../models/Product.js";
import {getFormatDate} from "../../utils/functions.js";

export const pageKeys = async (req, res) => {
    try {
        const productId = req.query.productId;
        const isActive = req.query.isActive;
        const page = +req.query.page || 1;
        const limit = 10;
        const skip = limit * (page - 1);
        const keyFilter = {};
        const products = await Product.find({countKeys: {$gt: 0}}).select(['name']).lean();
        
        const productsSync = await Product.find();
        
        for (const product of productsSync) {
            const keys = await Key.countDocuments({isActive: true, isSold: false, product: product._id});
    
            product.countKeys = +keys;
            await product.save();
            await product.changeInStock(product.countKeys > 0);
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
    try {
        const purchasePrice = +req.body.purchasePrice;
        const productId = req.body.productId;
        const isActive = req.body.isActive === 'on';
        let keys = req.body.keys;
        let expired = req.body.expired;
        
        if (!keys) {
            throw new Error('Ключ обязательный аргумент');
        }
    
        if (expired) {
            expired = new Date(expired);
        
            if (Date.now() > expired) {
                throw new Error('Срок ключа истек');
            }
        }
        
        const product = await Product.findById(productId);
        
        if (!product) {
            throw new Error('Данная игра не существует в базе');
        }
    
        const regExp = new RegExp('\\s');
    
        keys = keys.trim().split(regExp).map(key => key.trim()).filter(key => key.length && typeof key === 'string');
    
        if (!keys.length) {
            throw new Error('Keys not set');
        }
    
        for (let key of keys) {
            const keyObj = new Key({
                purchasePrice: purchasePrice || 0,
                value: key,
                product: productId,
                expired: expired || undefined,
                isActive,
            });
        
            await keyObj.save();
        }
        
        if (isActive) {
            product.countKeys += keys.length;
            
            await product.save();
            await product.changeInStock(true);
        }
        
        res.redirect('/admin/keys');
    } catch (e) {
        console.log(e);
        res.redirect('/admin/keys/add');
    }
}

export const editKeyPage = async (req, res) => {
    try {
        const keyId = req.params.keyId;
        const key = await Key.findById(keyId).lean();
        
        if (!key) {
            throw new Error('Key not found');
        }
    
        let products = await Product.find().select(['name']).lean();
    
        key.product = key.product.toString();
        key.expired = key.expired ? getFormatDate(key.expired, '-', ['y', 'm', 'd']) : undefined;
        products = products.map(product => ({...product, '_id': product._id.toString()}))
        
        res.render('addKey', {
            layout: 'admin',
            isEdit: true,
            products,
            key,
        });
    } catch (e) {
        console.log(e)
        res.redirect(`/admin/keys`)
    }
}

export const editKey = async (req, res) => {
    const keyId = req.params.keyId;
    
    try {
        const {productId, key} = req.body;
        const purchasePrice = +req.body.purchasePrice;
        const deactivationReason = req.body.deactivationReason;
        const isActive = req.body.isActive === 'on';
        let expired = +req.body.expired;
        let prevProductId = undefined;
        let changeActive = false;
        
        if (expired) {
            expired = new Date(expired);
            
            if (Date.now() > expired) {
                throw new Error('Срок ключа истек');
            }
        }
        
        const product = await Product.findById(productId);
        
        if (!product) {
            throw new Error('Данная игра не существует в базе');
        }
        
        const keyObj = await Key.findById(keyId);
        
        if (!keyObj) {
            throw 'Error';
        }
        
        if (productId !== keyObj.product.toString()) {
            prevProductId = keyObj.product;
        }
    
        changeActive = keyObj.isActive !== isActive;
    
        keyObj.value = key;
        keyObj.product = productId;
        keyObj.isActive = isActive;
        keyObj.expired = expired || undefined;
        keyObj.purchasePrice = purchasePrice || 0;
        keyObj.deactivationReason = isActive === 'on' ? undefined : deactivationReason || undefined;
        
        await key.save();
        
        if (prevProductId && !keyObj.isSold) {
            const prevProduct = await Product.findById(prevProductId);
            
            prevProduct.countKeys--;
            await prevProduct.save();
            await prevProduct.changeInStock(product.countKeys > 0);
            
            if (isActive) {
                product.countKeys++;
                await product.save();
                await product.changeInStock(true);
            }
        } else if (changeActive && !keyObj.isSold) {
            isActive ? product.countKeys++ : product.countKeys--;
            await product.save();
            await product.changeInStock(product.countKeys > 0);
        }
        
        res.redirect('/admin/keys');
    } catch (e) {
        console.log(e);
        res.redirect(`/admin/keys/edit/${keyId}`)
    }
}
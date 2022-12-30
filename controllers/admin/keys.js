import Key from "../../models/Key.js";
import Product from "../../models/Product.js";

export const pageKeys = async (req, res) => {
    try {
        const productId = req.query.productId;
        const isActive = req.query.isActive;
        const page = +req.query.page || 1;
        const limit = 10;
        const skip = limit * (page - 1);
        const keyFilter = {};
        const products = await Product.find({countKeys: {$gt: 0}}).select(['name']).lean();
    
        if (productId && productId !== 'notSelected') {
            keyFilter.product = productId;
        }
    
        if (isActive === 'on') {
            keyFilter.is_active = true;
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
            isActive: keyFilter.is_active,
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
        const purchasePrice = req.body.purchasePrice;
        let keys = req.body.keys;
        let keyValue = req.body.key;
        
        if (typeof keyValue !== 'string' && typeof keys !== 'string') {
            throw new Error('Не правильный тип данных ключа');
        } else if (!keyValue && !keys) {
            throw new Error('Ключ обязательный аргумент');
        }
    
        if (!!expired) {
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
                    key,
                    purchasePrice,
                    product: productId,
                    is_active: is_active === 'on',
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
            
            key.key = keyValue
            key.product = productId
            key.is_active = is_active === 'on'
            key.expired = expired || undefined
            key.purchasePrice = purchasePrice;
            
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
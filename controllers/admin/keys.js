import Key from "../../models/Key.js";
import Product from "../../models/Product.js";
//Наддо сделать пагинацию..
export const pageKeys = async (req, res) => {
    try {
        const keys = await Key.find({}).limit(100).exec();
        
        const prices = [
            {
                name: 'Elden Ring',
                price: 2435,
            },
            {
                name: 'Resident Evil 7',
                price: 330,
            },
            {
                name: 'Dark Souls Remastered',
                price: 1043,
            },
            {
                name: 'Resident Evil Village - Winters’ Expansion',
                price: 1065,
            },
            {
                name: 'Days Gone',
                price: 634,
            },
            {
                name: 'God of War',
                price: 1323,
            },
            {
                name: 'ELEX II',
                price: 869,
            },
            {
                name: 'Horizon Zero Dawn — Complete Edition',
                price: 691,
            },
        ];
        
        for (const price of prices) {
            const product = await Product.findOne({name: price.name}).select(['_id']).lean();
            
            if (!product) {
                continue;
            }
            
            const keys = await Key.find({product: product._id, $or: [{purchasePrice: 0}, {purchasePrice: undefined}, {purchasePrice: null}]}).select(['purchasePrice']);
            
            for (const key of keys) {
                key.purchasePrice = price.price;
                
                await key.save();
            }
        }
        
        res.render('listKeyAdminPage', {
            layout: 'admin',
            title: 'Список ключей',
            section: 'keys',
            elements: keys,
            addTitle: "Добавить ключ",
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
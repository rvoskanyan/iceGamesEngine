import Key from "../../models/Key.js";
import Product from "../../models/Product.js";
//Наддо сделать пагинацию..
export const pageKeys = async (req, res) => {
    try {
        const keys = await Key.find({}).limit(100).exec();
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
    let error_obj = {}
    let status = 200
    let $exp;
    
    try {
        const {productId, is_active, expired, is_edit} = req.body;
        const purchasePrice = req.body.purchasePrice;
        let keys = req.body.keys;
        let keyValue = req.body.key;
        
        if (typeof keyValue !== 'string' && typeof keys !== 'string') {
            error_obj.key = 'Не правильный тип данных ключа'
            status = 400
        } else if (!keyValue && !keys) {
            error_obj.key = 'Ключ обязательный аргумент'
            status = 400
        }
    
        if (!!expired) {
            const today = new Date();
            $exp = new Date(expired);
        
            if (today > $exp) {
                error_obj.expired = 'Срок ключа истек'
                status = 400
            }
        }
        
        const product = await Product.findById(productId);
        
        if (!product) {
            error_obj.product = 'Данная игра не существует в базе'
            status = 400
        }
        
        if (status > 200) {
            throw 'Error'
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
        console.log(e, error_obj);
        
        if (Object.keys(error_obj).length <= 0) {
            res.redirect('/admin/keys/add');
        }
        
        res.render('addKey', {
            layout: 'admin',
            is_error: true,
            error_obj,
            games: await Product.find({}).exec()
        })
    }
}


export const editKeyPage = async (req, res) => {
    try {
        let key = await Key.findById(req.params.keyId);
        
        if (!key) {
            return res.redirect('/admin/keys/add');
        }
    
        const products = await Product.find().select(['name']).lean();
        let expired = new Date(key.expired)
        let format_num = m=> m < 10 ? `0${m}`:m
        let get_month = x => format_num(x.getMonth()+1);
        
        expired = `${expired.getFullYear()}-${get_month(expired)}-${format_num(expired.getDate())}`;
        
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
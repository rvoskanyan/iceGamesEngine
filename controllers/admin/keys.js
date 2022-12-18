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
        const games = await Product.find({}).select(['name']);

        res.render('addKey', {
            layout: 'admin',
            games: games,
        });
    } catch (e) {
        console.log(e);
        res.json('Page error');
    }
}
// TODO rename function on FormActionKey
export const addKey = async (req, res) => {
    let error_obj = {}
    let status = 200
    let $exp;
    try {
        const {key, product, is_active, expired, is_edit} = req.body;
        let keys = req.body.keys
        // Validation
        if (typeof key !== 'string' && typeof keys !== 'string') {
            error_obj.key = 'Не правильный тип данных ключа'
            status = 400
        } else if (!key && !keys) {
            error_obj.key = 'Ключ обязательный аргумент'
            status = 400
        }
        let pd = await Product.findById(product).exec()
        if (!pd) {
            error_obj.product = 'Данная игра не существует в базе'
            status = 400
        }
        if (!!expired) {
            $exp = new Date(expired)
            let today = new Date()

            if (today > $exp) {
                error_obj.expired = 'Срок ключа истек'
                status = 400
            }
        }
        if (status > 200) throw 'Error'
        if (!is_edit) {
            keys = keys.split(' ').join('').split(',')
            if (keys <= 0) {
                keys = [key]
            }
            let stock = false
            for (let key of keys) {
                await Key.create({key, product, is_active: is_active === 'on', expired: $exp || null});
                stock = true
            }
            if (stock) {
                let $p = await Product.findById(product).exec()
                if (!!$p) {
                    $p.inStock = true
                    $p.countKeys +=  keys.length
                    await $p.save()
                }
            }
        }
        else {
            let $k = await Key.findById(req.params.key_id).exec()
            if (!$k) throw 'Error'
            $k.key = key
            $k.product = product
            $k.is_active = is_active === 'on'
            $k.expired = expired || null
            await $k.save()
        }
        res.redirect('/admin/keys');
    } catch (e) {
        console.log(e, error_obj);
        if (Object.keys(error_obj).length <= 0) res.redirect('/admin/keys/add');
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
        const games = await Product.find({}).select(['name']);
        let key = await Key.findById(req.params.key_id).exec()
        if (!key) {
            res.redirect('/admin/keys/add')
            return
        }
        let expired = new Date(key.expired)
        let format_num = m=> m < 10 ? `0${m}`:m
        let get_month = x => format_num(x.getMonth()+1)
        expired = `${expired.getFullYear()}-${get_month(expired)}-${format_num(expired.getDate())}`
        //TODO rename hbs template file to formActionKey
        res.render('addKey', {
            layout: 'admin',
            games,
            key, expired,
            is_edit: true,
            selected_game: key.product._id.toString()})
    } catch (e) {
        console.log(e)
        res.redirect('/admin/keys/')
    }
}
import {getExtendFile} from "../../utils/functions.js";
import {v4 as uuidv4} from "uuid";
import PaymentModule from "../../models/PaymentModule.js";
import path from "path";
import {__dirname} from "../../rootPathes.js";

export default {
    async createPaymentMethod(req, res) {
        try {
            let isPost = req.method.toLowerCase() === 'post'
            if (!isPost) {
                res.render('adminPaymentMethod', {
                    layout: 'admin',
                    title: 'Добавить метод оплаты',
                })
                return
            }

            let {body, files} = req
            let {name, secretToken, privateToken, publicToken, webhookSecret, is_active} = body
            let {icons} = files
            const imgExtend = getExtendFile(icons.name);
            const imgName = `${uuidv4()}.${imgExtend}`;
            const paymentMethod = new PaymentModule.paymentMethod({
                name, secretToken, privateToken, publicToken, webhookSecret, is_active: is_active === 'on'
            })
            let sPath = path.join(__dirname, '/uploadedFiles', imgName)
            await icons.mv(sPath)
            paymentMethod.icons = imgName;
            paymentMethod.save()
            res.redirect(`/admin/payment/method/${paymentMethod._id}`)
        } catch (e) {
            console.log(e);
            res.redirect('/admin')
        }
    },
    async updatePaymentMethod(req, res) {
        try {
            let isPost = req.method.toLowerCase() === 'post'
            if (!isPost) {
                let methodModel = await PaymentModule.paymentMethod.findById(req.params.payment_id).exec()
                if (!methodModel) {
                    res.redirect('/admin/payment/method')
                    return
                }
                console.log(methodModel)
                res.render('adminPaymentMethod', {
                    layout: 'admin',
                    title: 'Редактировать метод оплаты',
                    is_edit: true,
                    paymentMethod: {
                        name: methodModel.name,
                        id: methodModel.id,
                        secretToken: methodModel.secretToken,
                        privateToken: methodModel.privateToken,
                        publicToken: methodModel.publicToken,
                        webhookSecret: methodModel.webhookSecret,
                        is_active: methodModel.is_active,
                        icons: methodModel.icons
                    }
                })
                return
            }
            let {body, files} = req
            let {name, secretToken, privateToken, publicToken, webhookSecret, is_active} = body
            const paymentMethod = await PaymentModule.paymentMethod.findById(req.params.payment_id,).exec()
            if (!paymentMethod) {
                res.redirect('/admin/payment/method')
                return
            }
            Object.assign(paymentMethod, {
                name, secretToken, privateToken,
                publicToken, webhookSecret, is_active: is_active === 'on'
            })
            if (files) {
                let {icons} = files
                const imgExtend = getExtendFile(icons.name);
                const imgName = `${uuidv4()}.${imgExtend}`;
                let sPath = path.join(__dirname, '/uploadedFiles', imgName)
                await icons.mv(sPath)
                paymentMethod.icons = imgName;
            }
            paymentMethod.save()
            res.redirect(`/admin/payment/method/${req.params.payment_id}`)
        } catch (e) {
            console.log(e);
            res.redirect('/admin')
        }
    },
    async deletePaymentMethod(req, res) {

    },
}


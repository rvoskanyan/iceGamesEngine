import User from "../../models/User.js";
import {generation_number, generation_string} from "../../utils/functions.js";
import {sendConfirmCode, sendUserAuthData} from "../../services/mailer.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
    try {
        const {limit = 20, skip = 0} = req.query;
        const countUsers = await User.estimatedDocumentCount({locked: false, active: true});
        const users = await User
            .find({locked: false, active: true})
            .sort({rating: -1, createdAt: 1})
            .select(['login', 'rating'])
            .limit(limit)
            .skip(skip)
            .lean();

        res.json({
            success: true,
            isLast: +skip + +limit >= countUsers,
            countUsers,
            users,
        });
    } catch (e) {
        console.log(e);
        res.json({error: true});
    }
}

export const get_code = async (req, res) => {
    let status = 400
    try {
        let {email} = req.body
      console.log(res.locals.person)
        let e_regx = /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/gm;
        if (!email) throw "Email is empty"
        else if (!e_regx.test(email)) throw "Invalid email"
        if (res.locals.isAuth) {
            status = 402
            throw "Authorized"
        }
        let exist_user = await User.findOne({email: email}).exec()
        let code = generation_number().toString()
        let now = new Date()
        let expired = new Date(now.getTime() + 2 * 60000) // 2 minutes
        if (!!exist_user) {
            exist_user.try_code = expired
            exist_user.code = code
            await sendConfirmCode(email, code)
            exist_user.save()
            res.json({
                ok: true,
                expired
            })
            return;
        }
        let login = email.split("@")[0].toLowerCase()
        let checkLogin = async function (o, l, c = 0) {
            let u = await User.findOne({login: login}).exec()
            if (!l) l = o
            if (!u) return l
            c += 1
            return checkLogin(o, l + c, c)
        }
        login = await checkLogin(login)
        let user = User.create({email, login, code, try_code: expired, password: 'will_be_added_later'})
        await sendConfirmCode(email, code)
        res.json({
            ok: true,
            expired
        })
    } catch (e) {
        console.log(e)
        res.status(status).json({error: true, message: e})
    }
}

export const confirm_email = async (req, res) => {
    try {
        let {code, email} = req.body
        if (!code) throw "Code is empty"
        if (typeof code === 'string') {
            code = parseInt(code)
            if (isNaN(code)) throw 'Type not number'
        }
        if (typeof code === "object" || typeof code === 'boolean') throw 'Type error'
        if (code.toString().length !== 4) throw 'Invalid code'
        let user = await User.findOne({email}).exec()
        if (!user) throw 'User with this email not found'
        if (+user.code !== code) throw 'Invalid code'
        user.code = ''
        if (!user.emailChecked) user.emailChecked = true
        if (user.password === 'will_be_added_later') {
            let pass = generation_string()
            user.password = await bcrypt.hash(pass, 10)
            await sendUserAuthData(user.email, pass)
        }
        user.save()
        user.cart = res.locals.person.cart
        req.session.isAuth = true;
        req.session.role = user['role'];
        req.session.userId = user['_id'].toString();
        req.session.save(function (e) {
            if (e) throw e

          return res.json({
            ok: true
          })
        })
    } catch (e) {
        console.log(e)
        res.status(400).json({error: true, message: e})
    }
}

export const resend_code = async (req, res) => {
    try {
        let {email} = req.body
        let user = await User.findOne({email}).exec()
        if (!user) throw "User not found"
        let expired = user.try_code
        let now = new Date()
        if (expired > now) throw 'Try again'
        let code = generation_number()
        user.code = code
        expired = new Date(now.getTime() + 2 * 60000)
        user.try_code = expired
        sendConfirmCode(email, code)
        user.save()
        res.json({ok: true, expired})
    } catch (e) {
        console.log(e)
        res.status(400).json({error: true, message: e})
    }
}
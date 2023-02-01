import {validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';

import User from './../../models/User.js';
import {registrationMail, restoreMail} from "../../services/mailer.js";
import {v4 as uuidv4} from "uuid";

export const registration = async (req, res) => {
  try {
    const {login, email, password} = req.body;
    const {inviterId} = req.cookies;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: true,
        message: errors.array()[0].msg,
      });
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    const newLogin = login.toLowerCase();
    const checkEmailHash = uuidv4();
    const user = new User({
      login: newLogin[0].toUpperCase() + newLogin.slice(1),
      email,
      password: hashPassword,
      checkEmailHash,
      inviter: inviterId,
    });
      
    await user.save();
    
    if (inviterId) {
      const inviter = await User.findById(inviterId);
      
      if (inviter) {
        inviter.invitedUsers.push(user._id);
        await inviter.save();
        res.clearCookie('inviterId')
      }
    }
  
    res.json({
      success: true,
      message: 'Вы успешно зарегистрировались'
    });
  
    await registrationMail(email, checkEmailHash);
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
      message: 'Неизвестная ошибка, попробуйте позже или обратитесь в поддержку.',
    });
  }
}

export const auth = async (req, res) => {
  try {
    const {email, password} = req.body;
    
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: true,
        message: errors.array()[0].msg,
      });
    } else {
      const candidate = await User.findOne({email}).select(['password', 'role']);
      
      if (candidate) {
        const isPassValid = await bcrypt.compare(password, candidate['password']);
        
        if (isPassValid) {
          req.session.isAuth = true;
          req.session.userId = candidate['_id'].toString();
          req.session.save(err => {
            if (err) {
              throw err;
            }
  
            return res.json({
              success: true,
              message: 'Вы успешно авторизовались',
            });
          });
          
          return;
        }
      }
      
      res.json({
        error: true,
        message: 'Не верный E-mail или пароль',
      });
    }
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
      message: 'Неизвестная ошибка, попробуйте позже или обратитесь в поддержку.',
    });
  }
}

export const restore = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.find({email}).select(['password']);
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = '';
    
    if (!user.length) {
      return res.json({
        error: true,
        message: 'Пользователь с таким E-mail не найден',
      });
    }
    
    while (password.length < 12) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
  
    user[0].password = await bcrypt.hash(password, 10);
    await restoreMail(email, password);
    await user[0].save();
  
    res.json({
      success: true,
      message: 'Новый пароль отправлен на Ваш E-mail',
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
      message: 'Неизвестная ошибка, попробуйте позже или обратитесь в поддержку.',
    });
  }
}
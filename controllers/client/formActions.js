import {validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';

import User from './../../models/User.js';

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
    const user = new User({
      login,
      email,
      password: hashPassword,
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
          req.session.role = candidate['role'];
          req.session.userId = candidate['_id'].toString();
          req.session.dsCartId = candidate['dsCartId'];
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
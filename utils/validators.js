import {body} from 'express-validator';
import User from './../models/User.js';

export const registrationValidator = [
  body('login', 'Ник может состоять только из букв и цифр латинского алфавита и должен содержать от 3 до 15 символов')
    .isString()
    .isLength({min: 3, max: 15})
    .isAlphanumeric()
    .custom(async (value, {req}) => {
      try {
        const newValue = value.toLowerCase();
        const user = await User.findOne({login: newValue[0].toUpperCase() + newValue.slice(1)}).select(['_id']).lean();
        
        if (user) {
          return Promise.reject('Такой Ник уже занят');
        }
      } catch (e) {
        console.log(e);
        throw Error('Неизвестная ошибка, попробуйте позже или обратитесь в поддержку.');
      }
    }),
  body('email', 'Некорректно указан E-mail').normalizeEmail().isEmail().custom(async (value, {req}) => {
    try {
      const user = await User.findOne({email: value}).select(['_id']).lean();
    
      if (user) {
        return Promise.reject('Пользователь с таким E-mail уже зарегистрирован');
      }
    } catch (e) {
      console.log(e);
      throw Error('Неизвестная ошибка, попробуйте позже или обратитесь в поддержку.');
    }
  }),
  body('password', 'Пароль должен состоять минимум из 8 символов').isStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  }),
];

export const authValidator = [
  body('email' ).normalizeEmail(),
];

export const editProfileValidator = [
  body('email', 'Некорректно указан E-mail')
    .normalizeEmail()
    .isEmail()
    .custom(async (value, {req}) => {
      try {
        const user = await User.findOne({email: value}).select(['_id']).lean();
    
        if (user && user['_id'].toString() !== req.session.userId) {
          return Promise.reject('Данный E-mail уже занят');
        }
      } catch (e) {
        console.log(e);
        throw Error('Неизвестная ошибка, попробуйте позже или обратитесь в поддержку.');
      }
    }),
  body('login', 'Ник может состоять только из букв и цифр латинского алфавита и должен содержать от 3 до 15 символов')
    .isString()
    .isLength({min: 3, max: 15})
    .isAlphanumeric()
    .custom(async (value, {req}) => {
      try {
        const newValue = value.toLowerCase();
        const user = await User.findOne({login: newValue[0].toUpperCase() + newValue.slice(1)}).select(['_id']).lean();
  
        if (user && user['_id'].toString() !== req.session.userId) {
          return Promise.reject('Данный ник уже занят');
        }
      } catch (e) {
        console.log(e);
        throw Error('Неизвестная ошибка, попробуйте позже или обратитесь в поддержку.');
      }
    }),
  body('password')
    .custom(async (value, {req}) => {
      if (value && !req.body.newPassword) {
        return Promise.reject('Не указан новый пароль');
      }
    }),
  body('newPassword', 'Новый пароль должен состоять минимум из 8 символов')
    .optional()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    })
    .custom(async (value, {req}) => {
      if (value && !req.body.password) {
        return Promise.reject('Не указан текущий пароль');
      }
    }),
];
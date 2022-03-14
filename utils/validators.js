const {body} = require('express-validator/check');
const User = require('./../models/User');

exports.registrationValidator = [
  body('login', 'Некорректно указан Ник')
    .isString()
    .isLength({min: 3, max: 15})
    .isAlphanumeric()
    .custom(async (value, {req}) => {
      try {
        const user = await User.findOne({login: value}).select(['id', 'login']);
        
        if (user) {
          return Promise.reject('Такой Ник уже занят');
        }
      } catch (e) {
        console.log(e);
        throw Error('Неизвестная ошибка, попробуйте позже или обратитесь в поддержку.');
      }
    }),
  body('email', 'Некорректно указан E-mail').isEmail().custom(async (value, {req}) => {
    try {
      const user = await User.findOne({email: value}).select(['id']);
    
      if (user) {
        return Promise.reject('Пользователь с таким E-mail уже зарегистрирован');
      }
    } catch (e) {
      console.log(e);
      throw Error('Неизвестная ошибка, попробуйте позже или обратитесь в поддержку.');
    }
  }),
  body('password', 'Некорректно указан пароль').isLength({min: 6, max: 56}).isAlphanumeric(),
];

exports.authValidator = [
  body('email', 'Некорректно указан E-mail').isEmail(),
  body('password', 'Некорректно указан пароль').isLength({min: 6, max: 56}).isAlphanumeric(),
];

exports.editProfileValidator = [
  body('email', 'Некорректно указан E-mail').isEmail().custom(async (value, {req}) => {
    const user = await User.findOne({email: value});
    
    if (user && user['_id'].toString() !== req.session.userId) {
      return Promise.reject('Данный E-mail уже занят');
    }
  }),
  body('login', 'Некорректно указан Ник')
    .isString()
    .isLength({min: 3, max: 15})
    .isAlphanumeric()
    .custom(async (value, {req}) => {
      const user = await User.findOne({login: value});
    
      if (user && user['_id'].toString() !== req.session.userId) {
        return Promise.reject('Данный ник уже занят');
      }
    }),
  body('password')
    .custom(async (value, {req}) => {
      if (value && !req.body.newPassword) {
        return Promise.reject('Не указан новый пароль');
      }
    }),
  body('newPassword', 'Некорректно указан новый пароль')
    .optional()
    .isLength({min: 6, max: 56})
    .isAlphanumeric()
    .custom(async (value, {req}) => {
      if (value && !req.body.password) {
        return Promise.reject('Не указан текущий пароль');
      }
    }),
];
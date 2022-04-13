import {validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import Order from './../../models/Order.js';

export const profilePage = async (req, res) => {
  try {
    const {userId} = req.session;
    const user = await User.findById(userId);
    const countUsers = await User.estimatedDocumentCount();
    const orders = await Order.find({status: 'paid', userId});
    const purchasedProducts = orders.reduce((purchasedProducts, order) => purchasedProducts + order.products.length, 0);
    
    res.render('profile', {
      title: "ICE Games -- Мой профиль",
      isProfileHome: true,
      user,
      countUsers,
      purchasedProducts,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

export const profileEditPage = async (req, res) => {
  try {
    const {userId} = req.session;
    const user = await User.findById(userId);
  
    res.render('profileEdit', {
      title: "ICE Games -- Редактирование профиля",
      isProfileEdit: true,
      user,
    })
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

export const profileEdit = async (req, res) => {
  try {
    const {login, email, password, newPassword} = req.body;
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: true,
        message: errors.array()[0].msg,
      });
    }
    
    const user = await User.findById(req.session.userId).select(['password']).exec();
    
    if (password) {
      const isPassValid = await bcrypt.compare(password, user['password']);
      
      if (!isPassValid) {
        return res.json({
          error: true,
          message: "Неверно указан текущий пароль",
        });
      }
    }
    
    if (newPassword) {
      user['password'] = await bcrypt.hash(newPassword, 10);
    }
    
    if (login !== user.login) {
      user.login = login;
    }
  
    if (email !== user.email) {
      user.email = email;
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Данные успешно сохранены',
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
      message: 'Неизвестная ошибка, попробуйте позже или обратитесь в поддержку'
    });
  }
}

export const profileAchievementsPage = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    
    res.render('profileAchievements', {
      title: 'ICE Games -- Мои достижения',
      isProfileAchievements: true,
      user,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

export const profileInvitePage = async (req, res) => {
  try {
    const countUsers = await User.estimatedDocumentCount();
    const user = await User
      .findById(req.session.userId)
      .select(['login', 'invitedUsers'])
      .populate('invitedUsers', ['login']);
    
    res.render('profileInvite', {
      title: 'ICE Games -- Приглашенные друзья',
      isProfileInvite: true,
      userId: req.session.userId,
      invitedUsers: user.invitedUsers,
      countUsers,
      user,
    })
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

export const profileOrdersPage = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    
    res.render('profileOrders', {
      title: 'ICE Games -- Приобретенные товары',
      isProfileOrders: true,
      user,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

export const profileFavoritesPage = async (req, res) => {
  try {
    const user = await User
      .findById(req.session.userId)
      .select(['favoritesProducts'])
      .populate('favoritesProducts', ['name', 'alias', 'img', 'priceTo', 'priceFrom']);
    
    res.render('profileFavorites', {
      title: 'ICE Games -- Товары в избранном',
      isProfileFavorites: true,
      favorites: user.favoritesProducts,
    })
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

export const profileViewPage = async (req, res) => {
  try {
    const {login} = req.params;
    const user = await User.findOne({login}).select(['rating', 'invitedUsers', 'viewedArticles', 'createdAt']);
    const countUsers = await User.estimatedDocumentCount();
    
    user.login = login;
    
    res.render('profileViewPage', {
      title: 'ICE Games -- Профиль пользователя',
      user,
      countUsers,
    })
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
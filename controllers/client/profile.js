import {validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import Achievement from './../../models/Achievement.js';
import Article from './../../models/Article.js';
import Order from './../../models/Order.js';
import {getDiscount, getFormatDate} from "../../utils/functions.js";

export const profilePage = async (req, res) => {
  try {
    const countAchievements = res.locals.person.achievements ? res.locals.person.achievements.length : 0;
    const user = await res.locals.person.populate({path: 'achievements', options: {limit: 4}});
    const countUsers = await User.estimatedDocumentCount();
    const ratingPosition = await user.getRatingPosition();
    const articles = await Article
      .find({active: true})
      .sort({createdAt: -1})
      .select(['name', 'alias', 'introText', 'type', 'createdAt', 'img'])
      .limit(9);
  
    res.render('profile', {
      title: "ICE GAMES — Мой профиль",
      noIndex: true,
      noIndexGoogle: true,
      isProfileHome: true,
      user,
      countUsers,
      ratingPosition,
      countAchievements,
      articles,
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
      title: "ICE GAMES — Редактирование профиля",
      noIndex: true,
      noIndexGoogle: true,
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
      const newLogin = login.toLowerCase();
      user.login = newLogin[0].toUpperCase() + newLogin.slice(1);
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
    const user = res.locals.person;
    const {achievements} = await user.populate('achievements');
    const achievementIds = achievements.map(achievement => achievement._id.toString());
    let restFilter = {};
    
    if (achievementIds.length) {
      restFilter = {_id: {$nin: achievementIds}}
    }
    
    const restAchievements = await Achievement.find(restFilter);
    const achievementCount = achievements.length + restAchievements.length;
    const percent = 100 / achievementCount * achievements.length;
    
    res.render('profileAchievements', {
      title: 'ICE GAMES — Мои достижения',
      noIndex: true,
      noIndexGoogle: true,
      isProfileAchievements: true,
      user,
      achievements,
      restAchievements,
      achievementCount,
      percent,
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
      .select(['login', 'invitedUsers']);
    const invitedUsers = await User.find({_id: user.invitedUsers}).select('login');
    let invitedUsersWithRatingPosition = [];
    
    for (let invitedUser of invitedUsers) {
      const ratingPosition = await invitedUser.getRatingPosition();
  
      invitedUsersWithRatingPosition.push({
        ratingPosition,
        login: invitedUser.login,
      })
    }
    
    res.render('profileInvite', {
      title: 'ICE GAMES — Приглашенные друзья',
      noIndex: true,
      noIndexGoogle: true,
      isProfileInvite: true,
      userId: req.session.userId,
      invitedUsers: invitedUsersWithRatingPosition,
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
    const user = res.locals.person;
    const favoritesProducts = user.favoritesProducts;
    const cart = user.cart;
    let orders = await Order
      .find({userId: user._id})
      .sort({'createdAt': -1})
      .select(['products', 'createdAt', 'status', 'dsCartId'])
      .populate([
        {
          path: 'products.productId',
          select: ['name', 'alias', 'priceTo', 'priceFrom', 'img', 'preorder', 'releaseDate', 'activationServiceId', 'activationRegions'],
          populate: [
            {
              path: 'activationServiceId',
              select: ['name'],
            },
            {
              path: 'activationRegions',
              select: ['name'],
            },
          ]
        },
      ])
      .lean();
    
    orders = orders.map(order => {
      order.products = order.products.map(item => {
        const productId = item.productId._id.toString();
    
        if (favoritesProducts && favoritesProducts.includes(productId)) {
          item.productId.inFavorites = true;
        }
    
        if (cart && cart.includes(productId)) {
          item.productId.inCart = true;
        }
  
        item.purchasePrice = item.purchasePrice ? item.purchasePrice : item.productId.priceTo;
        item.discount = getDiscount(item.purchasePrice, item.productId.priceFrom);
        item.productId.releaseDate = getFormatDate(item.productId.releaseDate, '.', ['d', 'm', 'y']);
    
        return item;
      });
      
      order.createdAt = getFormatDate(order.createdAt, '.', ['d', 'm', 'y', 'hour', 'min', 'sec'], false, ':');
      
      return order;
    })
    
    res.render('profileOrders', {
      title: 'ICE GAMES — Приобретенные товары',
      noIndex: true,
      noIndexGoogle: true,
      isProfileOrders: true,
      orders,
      user,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

export const profileFavoritesPage = async (req, res) => {
  try {
    const user = await res.locals.person.populate('favoritesProducts', ['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dsId', 'dlc', 'inStock']);
    
    user.favoritesProducts = user.favoritesProducts.map(product => {
      if (user.cart && user.cart.includes(product._id)) {
        product.inCart = true;
      }
  
      return product;
    })
    
    res.render('profileFavorites', {
      title: 'ICE GAMES — Товары в избранном',
      noIndex: true,
      noIndexGoogle: true,
      isProfileFavorites: true,
      user,
    })
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
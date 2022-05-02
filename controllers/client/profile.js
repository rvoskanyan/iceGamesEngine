import {validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import Achievement from './../../models/Achievement.js';

export const profilePage = async (req, res) => {
  try {
    const countAchievements = res.locals.person.achievements.length;
    const user = await res.locals.person.populate({path: 'achievements', options: {limit: 4}});
    const countUsers = await User.estimatedDocumentCount();
    const ratingPosition = await user.getRatingPosition();
    
    res.render('profile', {
      title: "ICE Games — Мой профиль",
      noIndex: true,
      isProfileHome: true,
      user,
      countUsers,
      ratingPosition,
      countAchievements,
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
      title: "ICE Games — Редактирование профиля",
      noIndex: true,
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
      title: 'ICE Games — Мои достижения',
      noIndex: true,
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
      .select(['login', 'invitedUsers'])
      .populate('invitedUsers', ['login']);
    
    res.render('profileInvite', {
      title: 'ICE Games — Приглашенные друзья',
      noIndex: true,
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
      title: 'ICE Games — Приобретенные товары',
      noIndex: true,
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
    const user = await res.locals.person.populate('favoritesProducts', ['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dsId', 'dlc', 'inStock']);
    
    res.render('profileFavorites', {
      title: 'ICE Games — Товары в избранном',
      noIndex: true,
      isProfileFavorites: true,
      user,
    })
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
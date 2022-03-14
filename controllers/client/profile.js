const {validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const profilePage = async (req, res) => {
  try {
    const {userId} = req.session;
    const user = await User.findById(userId);
    
    res.render('profile', {
      title: "ICE Games -- Мой профиль",
      isProfileHome: true,
      user,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

const profileEditPage = async (req, res) => {
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

const profileEdit = async (req, res) => {
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
  
    console.log(user)
    
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

const profileAchievementsPage = async (req, res) => {
  try {
    res.render('profileAchievements', {
      title: 'ICE Games -- Мои достижения',
      isProfileAchievements: true,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

const profileInvitePage = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('invitedUsers').populate('invitedUsers', ['login']);
    
    res.render('profileInvite', {
      title: 'ICE Games -- Приглашенные друзья',
      isProfileInvite: true,
      userId: req.session.userId,
      invitedUsers: user.invitedUsers,
    })
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

const profileOrdersPage = async (req, res) => {
  try {
    res.render('profileOrders', {
      title: 'ICE Games -- Приобретенные товары',
      isProfileOrders: true,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

const profileFavoritesPage = async (req, res) => {
  try {
    res.render('profileFavorites', {
      title: 'ICE Games -- Товары в избранном',
      isProfileFavorites: true,
    })
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

module.exports = {
  profilePage,
  profileEditPage,
  profileEdit,
  profileAchievementsPage,
  profileInvitePage,
  profileOrdersPage,
  profileFavoritesPage,
}
import User from "../../models/User.js";
import Achievement from "../../models/Achievement.js";
import Order from "../../models/Order.js";

export const ratingPage = async (req, res) => {
  try {
    const countUsers = await User.estimatedDocumentCount({locked: false, active: true});
    const users = await User
      .find({locked: false, active: true})
      .sort({rating: -1, createdAt: 1})
      .select(['login', 'rating'])
      .limit(20)
      .lean();
    
    res.render('rating', {
      title: 'ICE GAMES — рейтинг пользователей',
      metaDescription: 'Призы самым активным! Отслеживайте свою позицию в магазине компьютерных игр ICE GAMES.',
      isRating: true,
      breadcrumbs: [{
        name: 'Рейтинг',
        current: true,
      }],
      users,
      countUsers,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

export const profileViewPage = async (req, res) => {
  try {
    const {login} = req.params;
    const normalizeLogin = login.toLowerCase();
    const user = await User
      .findOne({login: normalizeLogin[0].toUpperCase() + normalizeLogin.slice(1)})
      .select(['rating', 'login', 'invitedUsers', 'viewedArticles', 'createdAt', 'achievements', 'purchasedProducts'])
      .populate('achievements', ['icon', 'name', 'description']);
    const ratingPosition = await user.getRatingPosition();
    const countUsers = await User.estimatedDocumentCount();
    const countAchievements = user.achievements ? user.achievements.length : 0;
    const restAchievements = await Achievement
      .find({_id: {$nin: user.achievements}})
      .select(['icon', 'name', 'description'])
      .lean();
    const lastPurchasedProducts = [];
    let skipOrder = 0;
    
    while (lastPurchasedProducts.length < 5) {
      const order = await Order
        .findOne({userId: user._id, status: 'paid'})
        .sort({'createdAt': -1})
        .limit(1)
        .skip(skipOrder)
        .select('items')
        .populate('items.productId', ['name', 'alias', 'priceTo', 'priceFrom', 'img', 'dsId', 'inStock']);
      
      if (!order) {
        break;
      }
      
      for (let i = 0; i < order.items.length; i++) {
        if (lastPurchasedProducts.length > 3) {
          break;
        }
        
        lastPurchasedProducts.push(order.items[i].productId)
      }
  
      skipOrder++;
    }
    
    res.render('profileViewPage', {
      title: `ICE GAMES — Профиль пользователя ${login}`,
      metaDescription: `Личный профиль пользователя ${login} в магазине компьютерных игр ICE GAMES.`,
      ogType: 'profile',
      user,
      ratingPosition,
      countUsers,
      countAchievements,
      restAchievements,
      lastPurchasedProducts,
      breadcrumbs: [
        {
          name: 'Рейтинг пользователей',
          path: 'rating',
        },
        {
          name: user.login,
          current: true,
        },
      ],
    })
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
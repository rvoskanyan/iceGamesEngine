import User from "../../models/User.js";
import Achievement from "../../models/Achievement.js";
import Order from "../../models/Order.js";

export const ratingPage = async (req, res) => {
  try {
    const users = await User.find().sort({rating: -1, createdAt: 1}).limit(15);
    const countUsers = await User.estimatedDocumentCount();
    
    res.render('rating', {
      title: 'ICE Games — рейтинг пользователей',
      metaDescription: 'Страница со всеми пользователями нашего интернет-магазина и их позицией в рейтинге',
      isRating: true,
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
    const user = await User
      .findOne({login})
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
        .select('products')
        .populate('products.productId', ['name', 'alias', 'priceTo', 'priceFrom', 'img', 'dsId', 'inStock']);
      
      if (!order) {
        break;
      }
      
      for (let i = 0; i < order.products.length; i++) {
        if (lastPurchasedProducts.length > 3) {
          break
        }
        
        lastPurchasedProducts.push(order.products[i].productId)
      }
  
      skipOrder++;
    }
    
    res.render('profileViewPage', {
      title: `ICE Games — Профиль пользователя ${login}`,
      metaDescription: `Просмотр профиля пользователя ${login} на ICE Games`,
      user,
      ratingPosition,
      countUsers,
      countAchievements,
      restAchievements,
      lastPurchasedProducts,
    })
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
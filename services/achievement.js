import Achievement from './../models/Achievement.js';
import Order from './../models/Order.js';
import User from './../models/User.js';

export const achievementEvent = async (type, user) => {
  try {
    let amount;
  
    switch (type) {
      case 'articlesRead': {
        amount = user.viewedArticles.length;
        break;
      }
      case 'friendInvitation': {
        amount = user.invitedUsers.length;
        break;
      }
      case 'addProductFavorites': {
        amount = user.favoritesProducts.length;
        break;
      }
      case 'productPurchase': {
        amount = user.purchasedProducts;
        break;
      }
      case 'likeArticle': {
        amount = user.likedArticles.length;
        break;
      }
      case 'topRanking': {
        amount = await user.getRatingPosition();
        break;
      }
      default: throw new Error('Unknown type achievement');
    }
  
    const achievement = await Achievement.findOne({type, amount}).select(['_id']).lean();
  
    if (!achievement) {
      return;
    }
  
    const achievementExists = user.achievements.includes(achievement._id.toString());
  
    if (achievementExists) {
      return;
    }
  
    user.achievements.push(achievement._id);
    await user.save();
    await user.increaseRating(4);
  } catch (e) {
    console.log(e);
  }
}

export const creatingAchievement = async (type, amount, achievementId) => {
  try {
    let users = null;
  
    switch (type) {
      case 'articlesRead': {
        users = await User.find({[`viewedArticles.${amount - 1}`]: {$exists: true}}).select('achievements');
        break;
      }
      case 'friendInvitation': {
        users = await User.find({[`invitedUsers.${amount - 1}`]: {$exists: true}}).select('achievements');
        break;
      }
      case 'addProductFavorites': {
        users = await User.find({[`favoritesProducts.${amount - 1}`]: {$exists: true}}).select('achievements');
        break;
      }
      case 'productPurchase': {
        users = await User.find({purchasedProducts: {$gte: amount}}).select('achievements');
        break;
      }
      case 'likeArticle': {
        users = await User.find({[`likedArticles.${amount - 1}`]: {$exists: true}}).select('achievements');
        break;
      }
      case 'topRanking': {
        users = await User.find().sort({rating: -1, createdAt: 1}).select('achievements').limit(amount);
        break;
      }
      default: throw new Error('Unknown type achievement');
    }
    
    for (let user of users) {
      user.achievements.push(achievementId);
      await user.save();
    }
  } catch (e) {
    console.log(e);
  }
}
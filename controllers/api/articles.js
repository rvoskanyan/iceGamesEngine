import User from '../../models/User.js';
import Article from '../../models/Article.js';
import {achievementEvent} from "../../services/achievement.js";

export const likeArticle = async (req, res) => {
  try {
    const {articleId} = req.body;
    const user = res.locals.person;
    const article = await Article.findById(articleId).select(['likes']);
    const indexLikedArticle = user.likedArticles.findIndex(item => item.toString() === articleId);
  
    if (indexLikedArticle === -1) {
      user.likedArticles.push(articleId);
      article.likes += 1;
    } else {
      user.likedArticles.splice(indexLikedArticle, 1);
      article.likes -= 1;
    }
  
    await user.save();
    await article.save();
  
    if (indexLikedArticle === -1) {
      await achievementEvent('likeArticle', user)
    }
    
    res.json({
      countLikes: article.likes,
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
    });
  }
}
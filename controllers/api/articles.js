import Article from '../../models/Article.js';
import {achievementEvent} from "../../services/achievement.js";

export const getArticles = async (req, res) => {
  try {
    const {skip = 0, limit = 3, includeFixed = '1'} = req.query;
    const articles = await Article
      .find({active: true, fixed: includeFixed === '1'})
      .limit(limit)
      .skip(skip)
      .sort({createdAt: -1})
      .lean();
    const count = await Article.countDocuments({active: true, fixed: includeFixed === '1'});
    const isLast = +skip + +limit >= count;
    
    res.json({
      success: true,
      articles,
      isLast,
    });
  } catch (e) {
    console.log(e);
    res.json({err: true});
  }
}

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
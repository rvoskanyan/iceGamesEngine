import Article from './../../models/Article.js';
import {achievementEvent} from "./../../services/achievement.js";

export const blogHomePage = async (req, res) => {
  try {
    const articles = await Article.find({fixed: false}).limit(3);
    const fixArticle = await Article.findOne({fixed: true});
    
    res.render('blogHome', {
      title: 'ICE Games -- Блог',
      isBlog: true,
      fixArticle,
      articles,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

export const blogArticlePage = async (req, res) => {
  try {
    const article = await Article.findOne({alias: req.params.alias});
    
    if (req.session.isAuth) {
      const user = res.locals.person;
      const isArticleRead = user.viewedArticles.findIndex(item => item.toString() === article.id) !== -1;
      
      if (!isArticleRead) {
        user.viewedArticles.push(article._id);
        user.increaseRating(2);
        article.views += 1;
        
        await user.save();
        await article.save();
        await achievementEvent('articlesRead', user);
      }
    }
  
    res.render('blogArticle', {
      title: 'ICE Games -- Статья',
      article,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/blog');
  }
}
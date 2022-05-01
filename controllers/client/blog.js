import Article from './../../models/Article.js';
import {achievementEvent} from "./../../services/achievement.js";

export const blogHomePage = async (req, res) => {
  try {
    const articles = await Article.find({fixed: false}).limit(3);
    const fixArticle = await Article.findOne({fixed: true});
    
    res.render('blogHome', {
      title: 'ICE Games — Блог',
      metaDescription: 'Блог со всеми статьями и новостями на нашем интернет магазине ICE Games',
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
    const article = await Article
      .findOne({alias: req.params.alias})
      .populate('products', ['name', 'alias', 'priceTo', 'priceFrom', 'img', 'dsId', 'dlc']);
    
    if (req.session.isAuth) {
      const user = res.locals.person;
      const isArticleRead = user.viewedArticles.findIndex(item => item.toString() === article.id) !== -1;
      
      if (!isArticleRead) {
        user.viewedArticles.push(article._id);
        await user.save();
        
        user.increaseRating(2);
        article.views += 1;
        
        await article.save();
        await achievementEvent('articlesRead', user);
      }
    }
  
    res.render('blogArticle', {
      title: `ICE Games — ${article.name}`,
      metaDescription: article.metaDescription,
      article,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/blog');
  }
}
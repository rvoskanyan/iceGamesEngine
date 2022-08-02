import Article from './../../models/Article.js';
import {achievementEvent} from "./../../services/achievement.js";

export const blogHomePage = async (req, res) => {
  try {
    const articles = await Article
      .find({fixed: false, active: true})
      .sort({createdAt: -1})
      .limit(3);
    const fixArticle = await Article.findOne({fixed: true});
    
    res.render('blogHome', {
      title: 'ICE GAMES — Блог',
      metaDescription: 'Обзоры на игры, познавательные статьи и актуальные новости: все самое интересное в магазине компьютерных игр ICE GAMES.',
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
      .populate('products', ['name', 'alias', 'priceTo', 'priceFrom', 'img', 'dsId', 'dlc', 'inStock']);
    
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
      } else if (article.views < 1000) {
        article.views += 1;
        await article.save();
      }
    }
  
    res.render('blogArticle', {
      title: `ICE GAMES — ${article.name}`,
      metaDescription: article.metaDescription,
      article,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/blog');
  }
}
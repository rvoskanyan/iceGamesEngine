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
      title: 'Блог ICE GAMES',
      metaDescription: 'Обзоры игр, познавательные статьи и актуальные новости — всё самое интересное в магазине лицензионных ключей ICE GAMES.',
      ogPath: 'blog',
      isBlog: true,
      fixArticle,
      articles,
      breadcrumbs: [{
        name: 'Блог',
        current: true,
      }],
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
      title: `ICE GAMES Блог — ${article.name}`,
      metaDescription: article.metaDescription,
      ogPath: `blog/${article.alias}`,
      ogType: 'article',
      ogArticlePublishedTime: article.createdAt,
      ogArticleModifiedTime: article.updatedAt,
      ogArticleSection: article.type === 'news' ? 'Новости' : 'Статьи',
      article,
      ogImage: article.img,
      breadcrumbs: [
        {
          name: 'Блог',
          path: 'blog',
        },
        {
          name: article.name,
          current: true,
        },
      ],
    });
  } catch (e) {
    console.log(e);
    res.redirect('/blog');
  }
}
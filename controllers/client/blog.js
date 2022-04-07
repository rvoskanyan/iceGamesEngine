import Article from './../../models/Article.js';
import User from './../../models/User.js';

export const blogHomePage = async (req, res) => {
  try {
    const articles = await Article.find({fixed: false}).limit(3);
    const fixArticle = await Article.findOne({fixed: true});
  
    console.log(articles);
    console.log(fixArticle);
    
    res.render('blogHome', {
      title: 'ICE Games -- Блог',
      fixArticle,
      articles,
    });
  } catch (e) {
  
  }
}

export const blogArticlePage = async (req, res) => {
  try {
    const article = await Article.findOne({alias: req.params.alias});
    
    if (req.session.isAuth) {
      const user = await User.findById(req.session.userId).select(['viewedArticles']);
      const isArticleRead = user.viewedArticles.findIndex(item => item.toString() === article.id) !== -1;
      
      if (!isArticleRead) {
        user.viewedArticles.push(article._id);
        article.views += 1;
        
        await user.save();
        await article.save();
      }
    }
  
    res.render('blogArticle', {
      title: 'ICE Games -- Статья',
      article,
    });
  } catch (e) {
  
  }
}
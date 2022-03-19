const Article = require('../../models/Article');

const blogHomePage = async (req, res) => {
  try {
    const articles = await Article.find();
    
    res.render('blogHome', {
      title: 'ICE Games -- Блог',
      articles,
    });
  } catch (e) {
  
  }
}

const blogArticlePage = async (req, res) => {
  try {
    const article = await Article.findOne({alias: req.params.alias});
  
    res.render('blogArticle', {
      title: 'ICE Games -- Статья',
      article,
    });
  } catch (e) {
  
  }
}

module.exports = {
  blogHomePage,
  blogArticlePage,
}
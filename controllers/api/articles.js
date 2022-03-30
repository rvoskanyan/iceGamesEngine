const User = require('../../models/User');
const Article = require('../../models/Article');

const likeArticle = async (req, res) => {
  try {
    const {articleId} = req.body;
    const user = await User.findById(req.session.userId).select(['likedArticles']);
    const article = await Article.findById(articleId).select(['likes']);
    const indexLikedArticle = user.likedArticles.findIndex(item => item.toString() === articleId);
  
    console.log(article);
  
    if (indexLikedArticle === -1) {
      user.likedArticles.push(articleId);
      article.likes += 1;
    } else {
      user.likedArticles.splice(indexLikedArticle, 1);
      article.likes -= 1;
    }
  
    await user.save();
    await article.save();
    
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

module.exports = {
  likeArticle,
}
//const Product = require('./../../models/Product');
const {Schema} = require("mongoose");
const Product = require("../../models/Product");

/*Articles.find({_id: {$ne: article._id}, lang: 'default', categories: relCategory})
  .sort({moderated: -1})
  .limit(MyConfig.limits.relArticles)
  .exec(function(err, relarticles){
    
    if (res.locals.language == 'default'){
      
      res.locals.relarticles = relarticles;
      res.render('./client/article/article');
      
    } else {
      
      localizeArticles(relarticles, res.locals.language, article, true, function(relArray){
        res.locals.relarticles = relArray;
        res.render('./client/article/article');
      });
    }
  });*/

/*const products = await Product.find({
  _id: {
    $nin: article.products,
  }
}).select(['name']);*/

const getAllGames = async (req, res) => {
  try {
    res.json({
      message: 'success',
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
      message: 'Error',
    });
  }
}

module.exports = {
  getAllGames,
}
//const Product = require('./../../models/Product');
const {Schema} = require("mongoose");
const Product = require("../../models/Product");

/*
  Articles.find({_id: {$ne: article._id}})
 */

/*
  const products = await Product.find({
    _id: {
      $nin: article.products,
    }
  }).select(['name']);
*/

/*const result = await Product.aggregate.lookup({
  from: 'users',
  localField: 'userId',
  foreignField: '_id',
  as: 'users',
});*/

const getProducts = async (req, res) => {
  try {
    const {searchString} = req.query;
    const name = new RegExp(searchString, 'i');
    
    const products = await Product.find({name});
    
    res.json({
      message: 'success',
      products,
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
  getProducts,
}
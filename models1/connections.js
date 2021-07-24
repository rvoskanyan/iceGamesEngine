const productModel = require('./product');
const userModel = require('./user');

userModel.hasMany(productModel);
productModel.belongsTo(userModel);

module.exports = {
  productModel,
  userModel,
}
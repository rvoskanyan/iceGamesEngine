'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CategoryProduct extends Model {}
  
  CategoryProduct.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
  }, {
    sequelize,
    modelName: 'CategoryProduct',
  });
  
  return CategoryProduct;
};
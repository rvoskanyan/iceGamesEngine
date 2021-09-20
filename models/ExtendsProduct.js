'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExtendsProduct extends Model {}
  
  ExtendsProduct.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
  }, {
    sequelize,
    modelName: 'ExtendsProduct',
  });
  
  return ExtendsProduct;
};
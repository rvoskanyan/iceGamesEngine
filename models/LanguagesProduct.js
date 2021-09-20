'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LanguagesProduct extends Model {}
  
  LanguagesProduct.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
  }, {
    sequelize,
    modelName: 'LanguagesProduct',
  });
  
  return LanguagesProduct;
};
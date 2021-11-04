'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DevelopersProduct extends Model {}
  
  DevelopersProduct.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
  }, {
    sequelize,
    modelName: 'DevelopersProduct',
  });
  
  return DevelopersProduct;
};
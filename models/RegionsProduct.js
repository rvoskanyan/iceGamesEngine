'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RegionsProduct extends Model {}
  
  RegionsProduct.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
  }, {
    sequelize,
    modelName: 'RegionsProduct',
  });
  
  return RegionsProduct;
};
'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GenresProduct extends Model {}
  
  GenresProduct.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
  }, {
    sequelize,
    modelName: 'GenresProduct',
  });
  
  return GenresProduct;
};
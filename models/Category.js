'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      models.Category.belongsToMany(models.Product, {through: models.CategoryProduct});
      models.Product.belongsToMany(models.Category, {through: models.CategoryProduct});
    }
  }
  
  Category.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'Category',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return Category;
};
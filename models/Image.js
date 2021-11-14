'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      models.Image.belongsTo(models.Product, {
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
    }
  }
  
  Image.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'Image',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return Image;
};
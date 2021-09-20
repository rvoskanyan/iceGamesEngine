'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      models.ActivationService.hasMany(models.Product, {
        foreignKey: {
          name: 'activationServiceId',
          allowNull: false,
        }
      });
      models.Product.belongsTo(models.ActivationService, {
        foreignKey: {
          name: 'activationServiceId',
          allowNull: false,
        }
      });
    }
  }
  
  Product.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING(1000), allowNull: false},
    price: {type: DataTypes.FLOAT(8), allowNull: false},
    discount: {type: DataTypes.INTEGER},
    img: {type: DataTypes.STRING, allowNull: false},
    coverImg: {type: DataTypes.STRING},
    coverVideo: {type: DataTypes.STRING},
    inHomeSlider: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    cpu: {type: DataTypes.STRING, allowNull: false},
    graphicsCard: {type: DataTypes.STRING, allowNull: false},
    ram: {type: DataTypes.STRING, allowNull: false},
    diskMemory: {type: DataTypes.STRING, allowNull: false},
    rating: {type: DataTypes.FLOAT(2)},
    isActive: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
  }, {
    sequelize,
    modelName: 'Product',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return Product;
};
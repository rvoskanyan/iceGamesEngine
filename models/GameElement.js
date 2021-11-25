'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GameElement extends Model {
    static associate(models) {
      models.GameElement.belongsTo(models.Product, {
        foreignKey: {
          name: 'belongsProductId',
        }
      });
      models.GameElement.belongsTo(models.Product, {
        foreignKey: {
          name: 'productId',
        },
        as: 'Entity',
      });
    }
  }
  
  GameElement.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING(1000)},
  }, {
    sequelize,
    modelName: 'GameElement',
  });
  
  return GameElement;
};
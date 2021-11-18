'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ActivationService extends Model {
    static associate(models) {
      models.ActivationService.hasMany(models.Product, {
        foreignKey: {
          name: 'activationServiceId',
          allowNull: false,
        }
      });
  
      models.ActivationService.hasMany(models.ActivationStage, {
        foreignKey: {
          name: 'activationServiceId',
        }
      });
    }
  }
  
  ActivationService.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'ActivationService',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return ActivationService;
};
'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ActivationStage extends Model {
    static associate(models) {
      models.ActivationStage.belongsTo(models.ActivationService, {
        foreignKey: {
          name: 'activationServiceId',
        }
      });
    }
  }
  
  ActivationStage.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    text: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'ActivationStage',
  });
  
  return ActivationStage;
};
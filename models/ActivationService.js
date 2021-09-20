'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ActivationService extends Model {
    static associate(models) {}
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
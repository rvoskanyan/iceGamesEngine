'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Edition extends Model {
    static associate(models) {
      models.Edition.hasMany(models.Product, {
        foreignKey: {
          name: 'editionId',
        }
      });
    }
  }
  
  Edition.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'Edition',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return Edition;
};
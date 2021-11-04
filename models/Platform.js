'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Platform extends Model {
    static associate(models) {
      models.Platform.hasMany(models.Product, {
        foreignKey: {
          name: 'platformId',
          allowNull: false,
        }
      });
    }
  }
  
  Platform.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'Platform',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return Platform;
};
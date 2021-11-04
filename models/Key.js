'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Key extends Model {
    static associate(models) {
      models.Key.belongsTo(models.Product, {
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
    }
  }
  
  Key.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    key: {type: DataTypes.STRING, allowNull: false},
    active: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
  }, {
    sequelize,
    modelName: 'Key',
    indexes: [
      {unique: true, fields: ['key']}
    ]
  });
  
  return Key;
};
'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Extend extends Model {
    static associate(models) {
      models.Extend.belongsToMany(models.Product, {
        through: models.ExtendsProduct,
        foreignKey: {
          name: 'extendId',
          allowNull: false,
        }
      });
    }
  }
  
  Extend.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
    icon: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'Extend',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return Extend;
};
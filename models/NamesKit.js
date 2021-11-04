'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NamesKit extends Model {
    static associate(models) {
      models.NamesKit.hasMany(models.Kit, {
        foreignKey: {
          name: 'nameKitId',
          allowNull: false,
        }
      });
    }
  }
  
  NamesKit.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'NamesKit',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return NamesKit;
};
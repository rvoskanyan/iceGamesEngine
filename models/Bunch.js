'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bunch extends Model {
    static associate(models) {
      models.Bunch.hasMany(models.Product, {
        foreignKey: {
          name: 'bunchId',
        }
      });
    }
  }
  
  Bunch.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'Bunch',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return Bunch;
};
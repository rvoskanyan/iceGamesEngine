'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usp extends Model {
    static associate(models) {
      // define association here
    }
  }
  
  Usp.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    text: {type: DataTypes.STRING, allowNull: false},
    
  }, {
    sequelize,
    modelName: 'Usp',
    indexes: [
      {unique: true, fields: ['text']}
    ]
  });
  
  return Usp;
};
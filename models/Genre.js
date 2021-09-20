'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate(models) {
      // define association here
    }
  }
  
  Genre.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
    url: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'Genre',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return Genre;
};
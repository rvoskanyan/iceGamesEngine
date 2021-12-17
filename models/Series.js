'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Series extends Model {
    static associate(models) {
      models.Series.hasMany(models.Product, {
        foreignKey: {
          name: 'seriesId',
        }
      });
    }
  }
  
  Series.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'Series',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return Series;
};
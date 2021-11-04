'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Publisher extends Model {
    static associate(models) {
      models.Publisher.hasMany(models.Product, {
        foreignKey: {
          name: 'publisherId',
          allowNull: false,
        }
      });
    }
  }
  
  Publisher.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'Publisher',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return Publisher;
};
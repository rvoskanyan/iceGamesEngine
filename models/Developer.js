'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Developer extends Model {
    static associate(models) {
      models.Developer.belongsToMany(models.Product, {
        through: models.DevelopersProduct,
        foreignKey: {
          name: 'developerId',
          allowNull: false,
        }
      });
    }
  }
  
  Developer.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'Developer',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return Developer;
};
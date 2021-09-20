'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Region extends Model {
    static associate(models) {
      models.Product.belongsToMany(models.Region, {
        through: models.RegionsProduct,
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
      models.Region.belongsToMany(models.Product, {
        through: models.RegionsProduct,
        foreignKey: {
          name: 'regionId',
          allowNull: false,
        }
      });
    }
  }
  
  Region.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'Region',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return Region;
};
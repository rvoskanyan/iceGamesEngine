'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Kit extends Model {
    static associate(models) {
      models.NamesKit.hasMany(models.Kit, {
        foreignKey: {
          allowNull: false,
        }
      });
      models.Kit.belongsTo(models.NamesKit);
      
      models.Product.hasOne(models.Kit, {
        foreignKey: {
          allowNull: false,
        }
      });
      models.Kit.belongsTo(models.Product);
  
      models.Product.hasMany(models.Kit, {
        foreignKey: {
          name: 'mainProductId',
          allowNull: false,
        }
      });
      models.Kit.belongsTo(models.Product);
    }
  }
  
  Kit.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
  }, {
    sequelize,
    modelName: 'Kit',
    indexes: [
      {unique: true, fields: ['productId']}
    ]
  });
  
  return Kit;
};
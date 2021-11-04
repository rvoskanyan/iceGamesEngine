'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Kit extends Model {
    static associate(models) {
      models.Kit.hasMany(models.ElementsKit, {
        foreignKey: {
          name: 'kitId',
          allowNull: false,
        }
      });
      
      models.Kit.belongsTo(models.NamesKit, {
        foreignKey: {
          name: 'nameKitId',
          allowNull: false,
        }
      });
      
      models.Kit.belongsTo(models.Product, {
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
      
      models.Kit.belongsTo(models.Product, {
        foreignKey: {
          name: 'mainProductId',
          allowNull: false,
        }
      });
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
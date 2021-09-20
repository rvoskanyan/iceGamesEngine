'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ElementsKit extends Model {
    static associate(models) {
      models.Kit.hasMany(models.ElementsKit, {
        foreignKey: {
          allowNull: false,
        }
      });
      models.ElementsKit.belongsTo(models.Kit);
    }
  }
  
  ElementsKit.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    text: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'ElementsKit',
  });
  
  return ElementsKit;
};
'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ElementsKit extends Model {
    static associate(models) {
      models.ElementsKit.belongsTo(models.Kit, {
        foreignKey: {
          name: 'kitId',
          allowNull: false,
        }
      });
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
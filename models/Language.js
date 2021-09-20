'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Language extends Model {
    static associate(models) {
      models.Product.belongsToMany(models.Language, {
        through: models.LanguagesProduct,
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
      models.Language.belongsToMany(models.Product, {
        through: models.LanguagesProduct,
        foreignKey: {
          name: 'languageId',
          allowNull: false,
        }
      });
    }
  }
  
  Language.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
  }, {
    sequelize,
    modelName: 'Language',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return Language;
};
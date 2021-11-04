'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      models.Product.hasOne(models.Kit, {
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
  
      models.Product.hasMany(models.Kit, {
        foreignKey: {
          name: 'mainProductId',
          allowNull: false,
        }
      });
      
      models.Product.hasMany(models.Key, {
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
  
      models.Product.belongsTo(models.ActivationService, {
        foreignKey: {
          name: 'activationServiceId',
          allowNull: false,
        }
      });
  
      models.Product.belongsTo(models.Publisher, {
        foreignKey: {
          name: 'publisherId',
          allowNull: true,
        }
      });
  
      models.Product.belongsTo(models.Platform, {
        foreignKey: {
          name: 'platformId',
          allowNull: true,
        }
      });
  
      models.Product.belongsToMany(models.Region, {
        through: models.RegionsProduct,
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
  
      models.Product.belongsToMany(models.Language, {
        through: models.LanguagesProduct,
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
      
      models.Product.belongsToMany(models.Category, {
        through: models.CategoryProduct,
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
      
      models.Product.belongsToMany(models.Developer, {
        through: models.DevelopersProduct,
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
  
      models.Product.belongsToMany(models.Genre, {
        through: models.GenresProduct,
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
  
      models.Product.belongsToMany(models.Extend, {
        through: models.ExtendsProduct,
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
    }
  }
  
  Product.init({
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING(2000), allowNull: false},
    price: {type: DataTypes.FLOAT(8), allowNull: false},
    discount: {type: DataTypes.INTEGER},
    img: {type: DataTypes.STRING, allowNull: false},
    coverImg: {type: DataTypes.STRING},
    coverVideo: {type: DataTypes.STRING},
    inHomeSlider: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    releaseDate: {type: DataTypes.STRING, allowNull: true},
    os: {type: DataTypes.STRING, allowNull: true},
    cpu: {type: DataTypes.STRING, allowNull: false},
    graphicsCard: {type: DataTypes.STRING, allowNull: false},
    ram: {type: DataTypes.STRING, allowNull: false},
    diskMemory: {type: DataTypes.STRING, allowNull: true},
    rating: {type: DataTypes.FLOAT(2)},
    isActive: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
  }, {
    sequelize,
    modelName: 'Product',
    indexes: [
      {unique: true, fields: ['name']}
    ]
  });
  
  return Product;
};
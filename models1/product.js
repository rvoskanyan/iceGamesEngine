const Sequelize = require('sequelize');
const sequelize = require('./../utils/database');

const Product = sequelize.define('Product', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  idInDigiSeller: {
    type: Sequelize.STRING,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
  price: {
    type: Sequelize.FLOAT(6, 2),
    allowNull: false,
  },
  discount: {
    type: Sequelize.INTEGER,
  },
  img: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  coverImg: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  coverVideo: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  inStock: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  count: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  cpu: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  graphicsCard: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  ram: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  diskMemory: {
    type: Sequelize.STRING,
    allowNull: true,
  },
})

//type
//allowNull
//defaultValue
//unique
//primaryKey
//autoIncrement

module.exports = Product;
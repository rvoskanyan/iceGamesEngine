const Sequelize = require('sequelize');
const sequelize = require('./../utils/database');

const User = sequelize.define('User', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  name: {
    type: Sequelize.STRING,
  },
  surname: {
    type: Sequelize.STRING,
  },
  nickname: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "USER",
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
  phone: {
    type: Sequelize.STRING,
    unique: true,
  },
  dateBirth: {
    type: Sequelize.DATE,
  },
  city: {
    type: Sequelize.STRING,
  }
})

module.exports = User;
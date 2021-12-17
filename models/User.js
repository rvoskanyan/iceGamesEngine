'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  
  User.init({
    id: {allowNull:  false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    email: {type: DataTypes.STRING, allowNull: false},
    login: {type: DataTypes.STRING, allowNull: false},
    name: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, allowNull: false, defaultValue: 'client'},
    checkEmailSecret: {type: DataTypes.STRING},
    checkedEmail: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    isBlock: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    blockMessage: {type: DataTypes.STRING},
    isActive: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
  }, {
    sequelize,
    modelName: 'User',
    indexes: [
      {unique: true, fields: ['email']},
      {unique: true, fields: ['login']},
    ]
  });
  
  return User;
};

//type
//allowNull
//defaultValue
//unique
//primaryKey
//autoIncrement
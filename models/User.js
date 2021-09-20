'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'User',
    indexes: [
      {unique: true, fields: ['email']}
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
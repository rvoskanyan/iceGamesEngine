require('dotenv').config();

module.exports = {
  development: {
    username: 'iceGames',
    password: 'Evd6LiBnP$#cxS~',
    database: 'iceGames',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: `${process.env.IGS_DB_USERNAME}`,
    password: `${process.env.IGS_DB_PASSWORD}`,
    database: `${process.env.IGS_DB_NAME}`,
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: process.env.IGS_DB_USERNAME,
    password: process.env.IGS_DB_PASSWORD,
    database: process.env.IGS_DB_NAME,
    host: '127.0.0.1',
    dialect: 'mysql',
  }
};
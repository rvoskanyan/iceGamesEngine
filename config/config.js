require('dotenv').config();

module.exports = {
  development: {
    //username: 'root',
    //password: 'root',
    //database: 'ice_games_engine',
    //host: '127.0.0.1',
    //dialect: 'mysql',
  
    username: 'developer',
    password: 'Evd6LiBnP$#cxS~',
    database: 'iceGames',
    host: '185.251.88.215',
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
module.exports = {
  development: {
    username: 'root',
    password: 'root',
    database: 'ice_games_engine',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: process.env.IGS_DB_USERNAME,
    password: process.env.IGS_DB_PASSWORD,
    database: process.env.IGS_DB_NAME,
    host: '127.0.0.1',
    dialect: 'mysql',
    dialectOptions: {
      socketPath: '/tmp/mysql.sock',
    },
  },
  production: {
    username: process.env.IGS_DB_USERNAME,
    password: process.env.IGS_DB_PASSWORD,
    database: process.env.IGS_DB_NAME,
    host: '127.0.0.1',
    dialect: 'mysql',
    dialectOptions: {
      socketPath: '/tmp/mysql.sock',
    },
  }
};
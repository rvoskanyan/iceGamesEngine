const index = async (req, res) => {
  res.json({
    PORT: process.env.PORT,
    IGS_DB_USERNAME: process.env.IGS_DB_USERNAME,
    IGS_DB_PASSWORD: process.env.IGS_DB_PASSWORD,
    IGS_DB_NAME: process.env.IGS_DB_NAME,
    NODE_ENV: process.env.NODE_ENV,
  });
}

module.exports = {
  index,
};
const {Product} = require('./../../models/index');

const getAllGames = async (req, res) => {
  try {
    const {
      limit,
      offset,
      categories,
    } = req.query;
    //const games = await Product.findAndCountAll();
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
      message: 'Error',
    });
  }
}

module.exports = {
  getAllGames,
}
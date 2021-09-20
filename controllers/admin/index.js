const index = async (req, res) => {
  res.render('admin', {layout: 'admin'});
}

module.exports = {
  index
};
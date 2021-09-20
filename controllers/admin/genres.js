const {Genre} = require('./../../models/index');
const uuid = require("uuid");
const path = require("path");

const pageGenres = async (req, res) => {
  res.json('Genres page');
}

const pageAddGenres = async (req, res) => {
  res.render('addGenres', {layout: 'admin'});
}

const addGenres = async (req, res) => {
  try {
    const {name, url} = req.body;
    const {img} = req.files;
    const imgName = `${uuid.v4()}.jpg`;
  
    await img.mv(path.resolve(__dirname, '../../uploadedFiles', imgName));
  
    await Genre.create({name, img: imgName, url});
  
    res.redirect('/admin/genres');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/genres/add');
    res.json({error: true});
  }
}

module.exports = {
  pageGenres,
  pageAddGenres,
  addGenres,
}
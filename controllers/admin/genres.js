const uuid = require("uuid");
const path = require("path");
const Genre = require('./../../models/Genre');
const {getExtendFile} = require("../../utils/functions");

const pageGenres = async (req, res) => {
  try {
    const genres = await Genre.find().select(['name']);
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список жанров',
      section: 'genres',
      elements: genres,
      addTitle: "Добавить жанр",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

const pageAddGenres = async (req, res) => {
  res.render('addGenres', {layout: 'admin'});
}

const addGenres = async (req, res) => {
  try {
    const {name, url} = req.body;
    const {img} = req.files;
    const imgExtend = getExtendFile(img.name);
    const imgName = `${uuid.v4()}.${imgExtend}`;
  
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
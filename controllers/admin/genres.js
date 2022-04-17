import {v4 as uuidv4} from "uuid";
import path from "path";
import {__dirname} from "./../../rootPathes.js";
import Genre from './../../models/Genre.js';
import {getExtendFile} from "../../utils/functions.js";

export const pageGenres = async (req, res) => {
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

export const pageAddGenres = async (req, res) => {
  res.render('addGenres', {layout: 'admin'});
}

export const addGenres = async (req, res) => {
  try {
    const {name, url} = req.body;
    const {img} = req.files;
    const imgExtend = getExtendFile(img.name);
    const imgName = `${uuidv4()}.${imgExtend}`;
  
    await img.mv(path.join(__dirname, '/uploadedFiles', imgName));
  
    await Genre.create({name, img: imgName, url});
  
    res.redirect('/admin/genres');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/genres/add');
    res.json({error: true});
  }
}
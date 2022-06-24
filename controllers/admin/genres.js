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
    const {name, bgColor} = req.body;
    const {img} = req.files;
    const imgExtend = getExtendFile(img.name);
    const imgName = `${uuidv4()}.${imgExtend}`;
  
    await img.mv(path.join(__dirname, '/uploadedFiles', imgName));
    await Genre.create({name, img: imgName, bgColor});
  
    res.redirect('/admin/genres');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/genres/add');
  }
}

export const pageEditGenres = async (req, res) => {
  try {
    const {genreId} = req.params;
    const genre = await Genre.findById(genreId);
    
    res.render('addGenres', {
      layout: 'admin',
      isEdit: true,
      genre,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/genres');
  }
}

export const editGenres = async (req, res) => {
  const {genreId} = req.params;
  
  try {
    const genre = await Genre.findById(genreId);
    const {name, bgColor} = req.body;
    
    Object.assign(genre, {
      name,
      bgColor,
    })
    
    if (req.files.img) {
      const {img} = req.files;
      const imgExtend = getExtendFile(img.name);
      const imgName = `${uuidv4()}.${imgExtend}`;
  
      await img.mv(path.join(__dirname, '/uploadedFiles', imgName));
      genre.img = imgName;
    }
    
    await genre.save();
    
    res.redirect('/admin/genres');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/genres/edit/${genreId}`);
  }
}
import {v4 as uuidv4} from "uuid";
import path from "path";
import {__dirname} from "./../../rootPathes.js";
import Extend from "./../../models/Extend.js";
import {getExtendFile} from "./../../utils/functions.js";

export const pageExtends = async (req, res) => {
  try {
    const allExtends = await Extend.find().select(['name']);
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список расширений',
      section: 'extends',
      elements: allExtends,
      addTitle: 'Добавить расширение',
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const pageAddExtend = async (req, res) => {
  res.render('addExtend', {layout: 'admin'});
}

export const addExtend = async (req, res) => {
  try {
    const {name} = req.body;
    const {icon} = req.files;
    const iconExtend = getExtendFile(icon.name);
    const iconName = `${uuidv4()}.${iconExtend}`;
  
    await icon.mv(path.resolve(__dirname, '../../uploadedFiles', iconName));
  
    await Extend.create({name, icon: iconName});
    
    res.redirect('/admin/extends');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/extends/add');
  }
}
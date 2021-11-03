const uuid = require("uuid");
const path = require("path");
const {Extend} = require("./../../models/index");
const {getExtendFile} = require("../../utils/functions");

const pageExtends = async (req, res) => {
  try {
    const allExtends = await Extend.findAll({attributes: ['id', 'name']});
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список расширений',
      section: 'extends',
      elements: allExtends.map(item => item.dataValues),
      addTitle: "Добавить расширение",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

const pageAddExtend = async (req, res) => {
  res.render('addExtend', {layout: 'admin'});
}

const addExtend = async (req, res) => {
  try {
    const {name} = req.body;
    const {icon} = req.files;
    const iconExtend = getExtendFile(icon.name);
    const iconName = `${uuid.v4()}.${iconExtend}`;
  
    await icon.mv(path.resolve(__dirname, '../../uploadedFiles', iconName));
  
    await Extend.create({name, icon: iconName});
    
    res.redirect('/admin/extends');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/extends/add');
  }
}

module.exports = {
  pageExtends,
  pageAddExtend,
  addExtend,
}
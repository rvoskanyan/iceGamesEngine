import Partner from "../../models/Partner.js";
import {getExtendFile} from "../../utils/functions.js";
import {v4 as uuidv4} from "uuid";
import path from "path";
import {__dirname} from "../../rootPathes.js";

export const pagePartners = async (req, res) => {
  try {
    const partners = await Partner.find().lean();
  
    res.render('listElements', {
      layout: 'admin',
      title: 'Список партнеров',
      section: 'partners',
      elements: partners,
      addTitle: "Добавить партнера",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const pageAddPartner = (req, res) => {
  res.render('addPartner', {layout: 'admin'});
}

export const addPartner = async (req, res) => {
  try {
    const {name, link} = req.body;
    const {img} = req.files;
    const imgExtend = getExtendFile(img.name);
    const imgName = `${uuidv4()}.${imgExtend}`;
    
    await img.mv(path.join(__dirname, '/uploadedFiles', imgName));
    await Partner.create({name, img: imgName, link});
    
    res.redirect('/admin/partners');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/partners/add');
  }
}

export const pageEditPartners = async (req, res) => {
  try {
    const {partnerId} = req.params;
    const partner = await Partner.findById(partnerId);
    
    res.render('addPartner', {
      layout: 'admin',
      isEdit: true,
      partner,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/partners');
  }
}

export const editPartner = async (req, res) => {
  const {partnerId} = req.params;
  
  try {
    const partner = await Partner.findById(partnerId);
    const {name, link} = req.body;
    
    Object.assign(partner, {
      name,
      link,
    })
    
    if (req.files) {
      const {img = null} = req.files;
      
      if (img) {
        const imgExtend = getExtendFile(img.name);
        const imgName = `${uuidv4()}.${imgExtend}`;
        
        await img.mv(path.join(__dirname, '/uploadedFiles', imgName));
        partner.img = imgName;
      }
    }
    
    await partner.save();
    
    res.redirect('/admin/partners');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/partners/edit/${partnerId}`);
  }
}
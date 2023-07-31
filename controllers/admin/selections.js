import Selection from "../../models/Selection.js";
import Product from "../../models/Product.js";
import {getExtendFile} from "../../utils/functions.js";
import {v4 as uuidv4} from "uuid";
import path from "path";
import {__dirname} from "../../rootPathes.js";
import selections from "../../routes/admin/selections.js";

export const getSelectionsPage = async (req, res) => {
  try {
    const selections = await Selection.find().sort({createdAt: -1});
    
    for (const selection of selections) {
      if (selection.products.length) {
        continue;
      }
      
      selection.products = selection.items.map(item => item.product);
      
      await selection.save();
    }
  
    res.render('listElements', {
      layout: 'admin',
      title: 'Список подборок',
      section: 'selections',
      elements: selections,
      addTitle: "Добавить подборку",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const addSelectionPage = (req, res) => {
  res.render('addSelection', {
    layout: 'admin',
    title: 'Добавление новой подборки',
  });
}

export const addSelection = async (req, res) => {
  try {
    if (!req.files) {
      throw new Error('No media');
    }
    
    const {
      name = '',
      alias = '',
      description = '',
      inHome,
      ourChoice,
    } = req.body;
    
    const {
      img = undefined,
      coverImg = undefined,
    } = req.files;
    
    if (!img || !coverImg || !name.length || !description.length) {
      throw new Error('All fields is required');
    }
    
    const imgName = `${ uuidv4() }.${ getExtendFile(img.name) }`;
    const coverImgName = `${ uuidv4() }.${ getExtendFile(coverImg.name) }`;
  
    await img.mv(path.join(__dirname, '/uploadedFiles', imgName));
    await coverImg.mv(path.join(__dirname, '/uploadedFiles', coverImgName));
    
    const selection = new Selection({
      name,
      alias,
      description,
      img: imgName,
      coverImg: coverImgName,
      inHome: inHome === 'on',
      ourChoice: ourChoice === 'on',
    });
  
    await selection.save();
    
    if (ourChoice === 'on') {
      const currentOurChoice = await Selection.findOne({
        ourChoice: true,
        _id: {
          $not: selection._id.toString(),
        }
      });
      
      if (currentOurChoice) {
        currentOurChoice.ourChoice = false;
        
        await currentOurChoice.save();
      }
    }
    
    res.redirect('/admin/selections');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/selections/add');
  }
}

export const editSelectionPage = async (req, res) => {
  try {
    const selectionId = req.params.selectionId;
    const selection = await Selection.findById(selectionId).populate([{
      path: 'products',
      select: ['name'],
    }]).lean();
    
    res.render('addSelection', {
      layout: 'admin',
      title: 'Редактирование подборки',
      isEdit: true,
      selection,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/selections');
  }
}

export const editSelection = async (req, res) => {
  const selectionId = req.params.selectionId;
  
  try {
    const {
      name = '',
      alias = '',
      description = '',
      inHome,
      ourChoice,
    } = req.body;
    
    if (!name.length || !description.length) {
      throw new Error('Not all required fields are filled');
    }
  
    const selection = await Selection.findById(selectionId);
    
    if (req.files) {
      const {
        img = undefined,
        coverImg = undefined,
      } = req.files;
      
      if (img) {
        const imgName = `${ uuidv4() }.${ getExtendFile(img.name) }`;
  
        await img.mv(path.join(__dirname, '/uploadedFiles', imgName));
  
        selection.img = imgName;
      }
  
      if (coverImg) {
        const coverImgName = `${ uuidv4() }.${ getExtendFile(coverImg.name) }`;
    
        await coverImg.mv(path.join(__dirname, '/uploadedFiles', coverImgName));
    
        selection.coverImg = coverImgName;
      }
    }
  
    selection.name = name;
    selection.alias = alias;
    selection.description = description;
    selection.inHome = inHome === 'on';
    selection.ourChoice = ourChoice === 'on';
    
    await selection.save();
  
    if (ourChoice === 'on') {
      const currentOurChoice = await Selection.findOne({
        ourChoice: true,
        _id: {
          $not: selection._id.toString(),
        }
      });
    
      if (currentOurChoice) {
        currentOurChoice.ourChoice = false;
      
        await currentOurChoice.save();
      }
    }
    
    res.redirect('/admin/selections');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/selections/edit/${ selectionId }`);
  }
}

export const addItemSelectionPage = async (req, res) => {
  const selectionId = req.params.selectionId;
  
  try {
    const selection = await Selection.findById(selectionId).select(['products']).lean();
    const products = await Product
      .find({ _id: { $nin: selection.products }, active: true })
      .select([ 'name' ])
      .sort({ priceTo: -1 })
      .lean();
    
    res.render('addProductSelection', {
      layout: 'admin',
      title: 'Добавление товара в подборку',
      products,
      selection,
    });
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/selections/edit/${ selectionId }`);
  }
}

export const addItemSelection = async (req, res) => {
  const selectionId = req.params.selectionId;
  
  try {
    let {
      productIds = [],
    } = req.body;
    
    if (!Array.isArray(productIds)) {
      productIds = [productIds];
    }
    
    if (!productIds.length) {
      throw new Error('Product is required');
    }
    
    const products = await Product.find({_id: { $in: productIds }}).select(['_id', 'active']).lean();
    
    if (!products.length) {
      throw new Error('Product not found or product not active');
    }
    
    const selection = await Selection.findById(selectionId);
    
    if (!selection) {
      throw new Error('Selection not found');
    }
  
  
    selection.products = [
      ...selection.products,
      ...products.map(product => product._id),
    ]
    
    await selection.save();
    res.redirect(`/admin/selections/edit/${ selectionId }`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/selections/${ selectionId }/addItem`);
  }
}

export const deleteItemSelection = async (req, res) => {
  const selectionId = req.params.selectionId;
  
  try {
    const selection = await Selection.findById(selectionId).select(['products']);
    const itemId = req.params.itemId;
    
    selection.products = selection.products.filter(item => item._id.toString() !== itemId);
    await selection.save();
  } catch (e) {
    console.log(e);
  } finally {
    res.redirect(`/admin/selections/edit/${ selectionId }`);
  }
}
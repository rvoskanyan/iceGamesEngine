import Selection from "../../models/Selection.js";
import Product from "../../models/Product.js";
import {getExtendFile} from "../../utils/functions.js";
import {v4 as uuidv4} from "uuid";
import path from "path";
import {__dirname} from "../../rootPathes.js";
import selections from "../../routes/admin/selections.js";

export const getSelectionsPage = async (req, res) => {
  try {
    const selections = await Selection.find().select(['name']).sort({createdAt: -1}).lean();
  
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
      description = '',
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
      description,
      img: imgName,
      coverImg: coverImgName,
    });
  
    await selection.save();
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
      path: 'items.product',
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
      description = '',
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
    selection.description = description;
    
    await selection.save();
    res.redirect('/admin/selections');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/selections/edit/${ selectionId }`);
  }
}

export const addItemSelectionPage = async (req, res) => {
  const selectionId = req.params.selectionId;
  
  try {
    const selection = await Selection.findById(selectionId).select(['items.product']).lean();
    const selectionProductIds = selection.items.map(item => item.product);
    const products = await Product
      .find({_id: {$nin: selectionProductIds}, active: true})
      .select(['name'])
      .sort({priceTo: -1})
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
      ourChoice = '',
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
  
  
    selection.items = [
      ...selection.items,
      ...productIds.map(id => ({
        product: id,
        ourChoice: ourChoice === 'on',
      }))
    ]
    
    await selection.save();
    res.redirect(`/admin/selections/edit/${ selectionId }`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/selections/${ selectionId }/addItem`);
  }
}

export const editItemSelectionPage = async (req, res) => {
  const selectionId = req.params.selectionId;
  
  try {
    const itemId = req.params.itemId;
    const selection = await Selection.findById(selectionId).select(['items']).lean();
    
    const editItem = selection.items.filter(item => item._id.toString() === itemId)[0];
    const editItemProductId = editItem.product;
    
    if (!editItemProductId) {
      throw new Error('Edit item nor found');
    }
    
    const editItemProduct = await Product.findById(editItemProductId).select(['name']).lean();
    
    if (!editItemProduct) {
      throw new Error('Product not found');
    }
    
    const selectionProductIds = selection.items.map(item => item.product);
    const products = await Product
      .find({_id: {$nin: selectionProductIds}, active: true})
      .select(['name'])
      .sort({priceTo: -1})
      .lean();
    
    products.unshift({
      ...editItemProduct,
      selected: true,
    })
  
    res.render('addProductSelection', {
      layout: 'admin',
      title: 'Редактирование товара из подборки',
      isEdit: true,
      item: editItem,
      products,
      selection,
    });
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/selections/edit/${ selectionId }`);
  }
}

export const editItemSelection = async (req, res) => {
  const selectionId = req.params.selectionId;
  const itemId = req.params.itemId;
  
  try {
    const { ourChoice = '' } = req.body;
    
    if (!selectionId.length || !itemId.length) {
      throw new Error('Error data');
    }
    
    const selection = await Selection.findById(selectionId).select(['items']);
    
    if (!selection) {
      throw new Error('Selection not found');
    }
    
    const editableItemIndex = selection.items.findIndex(item => item._id.toString() === itemId);
    
    if (editableItemIndex === -1) {
      throw new Error('Editable element not found');
    }
    
    selection.items[editableItemIndex].ourChoice = ourChoice === 'on';
    
    await selection.save();
    res.redirect(`/admin/selections/edit/${ selectionId }`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/selections/${ selectionId }/editItem/${ itemId }`);
  }
}

export const deleteItemSelection = async (req, res) => {
  const selectionId = req.params.selectionId;
  
  try {
    const selection = await Selection.findById(selectionId).select(['items']);
    const itemId = req.params.itemId;
    
    selection.items = selection.items.filter(item => item._id.toString() !== itemId);
    await selection.save();
  } catch (e) {
    console.log(e);
  } finally {
    res.redirect(`/admin/selections/edit/${ selectionId }`);
  }
}
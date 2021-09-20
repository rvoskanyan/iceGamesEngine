const uuid = require('uuid');
const path = require('path');
const {
  Product,
  Category,
  NamesKit,
  Kit,
  ElementsKit,
  Extend,
  Language,
  Region,
  ActivationService,
} = require('../../models/index');

const pageProducts = async (req, res) => {
  res.json("Products page");
}

const pageAddProduct = async (req, res) => {
  const categories = await Category.findAll({attributes: ['id', 'name']});
  const allExtends = await Extend.findAll({attributes: ['id', 'name']});
  const languages = await Language.findAll({attributes: ['id', 'name']});
  const regions = await Region.findAll({attributes: ['id', 'name']});
  const activationServices = await ActivationService.findAll({attributes: ['id', 'name']});
  
  res.render('addProducts', {
    layout: 'admin',
    title: "Добавление новой игры",
    extends: allExtends.map(item => item.dataValues),
    languages: languages.map(item => item.dataValues),
    categories: categories.map(item => item.dataValues),
    regions: regions.map(item => item.dataValues),
    activationServices: activationServices.map(item => item.dataValues),
  });
}

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      inHomeSlider,
      cpu,
      graphicsCard,
      ram,
      diskMemory,
      categories,
      gameExtends,
      languages,
      regions,
      activationService,
    } = req.body;
    
    const {img, coverImg, coverVideo} = req.files;
    const imgName = `${uuid.v4()}.jpg`;
    let coverImgName = null;
    let coverVideoName = null;
    
    await img.mv(path.resolve(__dirname, '../../uploadedFiles', imgName));
    
    if (coverImg) {
      coverImgName = `${uuid.v4()}.jpg`;
      await coverImg.mv(path.resolve(__dirname, '../../uploadedFiles', coverImgName));
    }
  
    if (coverVideo) {
      coverVideoName = `${uuid.v4()}.mp4`;
      await coverVideo.mv(path.resolve(__dirname, '../../uploadedFiles', coverVideoName));
    }
  
    const product = await Product.create({
      name,
      description,
      price,
      discount,
      inHomeSlider: inHomeSlider === "on",
      cpu,
      graphicsCard,
      ram,
      diskMemory,
      img: imgName,
      coverImg: coverImgName,
      coverVideo: coverVideoName,
      activationServiceId: activationService,
    })
  
    await product.setCategories(categories.map(item => +item));
    await product.setExtends(gameExtends.map(item => +item));
    await product.setLanguages(languages.map(item => +item));
    await product.setRegions(regions.map(item => +item));
    
    res.redirect('/admin/products');
    
  } catch (e) {
    console.log(e);
    res.redirect('/admin/products/add');
    res.json({error: true});
  }
}

const pageAddGameKid = async (req, res) => {
  try {
    const {gameId} = req.params;
    const games = await Product.findAll({
      attributes: ['id', 'name'],
    });
    const namesKits = await NamesKit.findAll({
      attributes: ['id', 'name'],
    });
    
    res.render('addGameKit', {
      layout: 'admin',
      gameId,
      games,
      namesKits,
    });
  } catch (e) {
    console.log(e);
  }
}

const addGameKid = async (req, res) => {
  const {gameId} = req.params;
  
  try {
    const {productId, namesKitId} = req.body;
    
    await Kit.create({ProductId: productId, NamesKitId: namesKitId, mainProductId: gameId});
  
    res.redirect(`/admin/products`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/${gameId}/addKit`);
  }
}

const pageAddElementKit = async (req, res) => {
  const {gameId, kitId} = req.params;
  
  res.render('addElementKit', {
    layout: 'admin',
    gameId,
    kitId,
  });
}

const addElementKit = async (req, res) => {
  const {gameId, kitId} = req.params;
  
  try {
    const {text} = req.body;
    
    await ElementsKit.create({text, KitId: kitId});
    res.redirect(`/admin/products`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/${gameId}/${kitId}/addElementKit`);
  }
}

module.exports = {
  pageProducts,
  pageAddProduct,
  addProduct,
  pageAddGameKid,
  addGameKid,
  pageAddElementKit,
  addElementKit,
};
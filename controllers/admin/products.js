const {Op} = require('sequelize');
const {getExtendFile} = require("../../utils/functions");
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
  try {
    const games = await Product.findAll({attributes: ['id', 'name']});
  
    res.render('listElements', {
      layout: 'admin',
      title: 'Список игры',
      section: 'products',
      elements: games.map(item => item.dataValues),
      addTitle: "Добавить игру",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
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

const pageEditProduct = async (req, res) => {
  const {gameId} = req.params;
  
  try {
    const game = await Product.findByPk(gameId);
  
    const gameCategories = await game.getCategories({attributes: ['id', 'name']});
    const gameExtends = await game.getExtends({attributes: ['id', 'name']});
    const gameLanguages = await game.getLanguages({attributes: ['id', 'name']});
    const gameRegions = await game.getRegions({attributes: ['id', 'name']});
    const gameActivationService = await game.getActivationService({attributes: ['id', 'name']});
  
    const categoryIds = gameCategories.map(item => item.dataValues.id);
    const extentIds = gameExtends.map(item => item.dataValues.id);
    const languageIds = gameLanguages.map(item => item.dataValues.id);
    const regionIds = gameRegions.map(item => item.dataValues.id);
    const activationServiceId = gameActivationService.dataValues.id;
  
    const restCategories = await Category.findAll({
      attributes: ['id', 'name'],
      where: {
        id: {
          [Op.notIn]: [...categoryIds]
        }
      }
    });
  
    const restExtends = await Extend.findAll({
      attributes: ['id', 'name'],
      where: {
        id: {
          [Op.notIn]: [...extentIds]
        }
      }
    });
  
    const restLanguages = await Language.findAll({
      attributes: ['id', 'name'],
      where: {
        id: {
          [Op.notIn]: [...languageIds]
        }
      }
    });
  
    const restRegions = await Region.findAll({
      attributes: ['id', 'name'],
      where: {
        id: {
          [Op.notIn]: [...regionIds]
        }
      }
    });
  
    const restActivationServices = await ActivationService.findAll({
      attributes: ['id', 'name'],
      where: {
        id: {
          [Op.notIn]: [activationServiceId]
        }
      }
    });
  
    const categories = [
      ...gameCategories.map(item => {
        return {
          id: item.dataValues.id,
          name: item.dataValues.name,
          selected: true,
        }
      }),
      ...restCategories.map(item => item.dataValues),
    ];
  
    const allExtends = [
      ...gameExtends.map(item => {
        return {
          id: item.dataValues.id,
          name: item.dataValues.name,
          selected: true,
        }
      }),
      ...restExtends.map(item => item.dataValues),
    ];
  
    const languages = [
      ...gameLanguages.map(item => {
        return {
          id: item.dataValues.id,
          name: item.dataValues.name,
          selected: true,
        }
      }),
      ...restLanguages.map(item => item.dataValues),
    ];
  
    const regions = [
      ...gameRegions.map(item => {
        return {
          id: item.dataValues.id,
          name: item.dataValues.name,
          selected: true,
        }
      }),
      ...restRegions.map(item => item.dataValues),
    ];
  
    const activationServices = [
      {
        id: gameActivationService.dataValues.id,
        name: gameActivationService.dataValues.name,
        selected: true,
      },
      ...restActivationServices.map(item => item.dataValues),
    ];
  
    res.render('addProducts', {
      layout: 'admin',
      title: "Редактирование игры",
      isEdit: true,
      categories,
      extends: allExtends,
      languages,
      regions,
      activationServices,
      game: game.dataValues,
    });
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/`);
    res.json({error: true});
  }
}

const editProduct = async (req, res) => {
  const {gameId} = req.params;
  
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
  
    const values = {
      name,
      description,
      price,
      discount,
      inHomeSlider: inHomeSlider === "on",
      cpu,
      graphicsCard,
      ram,
      diskMemory,
      activationServiceId: activationService,
    }
    
    if (req.files) {
      const {img, coverImg, coverVideo} = req.files;
  
      let imgName = null;
      let coverImgName = null;
      let coverVideoName = null;
  
      if (img) {
        const extend = getExtendFile(img.name);
    
        imgName = `${uuid.v4()}.${extend}`;
        await img.mv(path.resolve(__dirname, '../../uploadedFiles', imgName));
        values.img = imgName;
      }
  
      if (coverImg) {
        const extend = getExtendFile(coverImg.name);
    
        coverImgName = `${uuid.v4()}.${extend}`;
        await coverImg.mv(path.resolve(__dirname, '../../uploadedFiles', coverImgName));
        values.coverImg = coverImgName;
      }
  
      if (coverVideo) {
        const extend = getExtendFile(coverVideo.name);
    
        coverVideoName = `${uuid.v4()}.${extend}`;
        await coverVideo.mv(path.resolve(__dirname, '../../uploadedFiles', coverVideoName));
        values.coverVideo = coverVideoName;
      }
    }
  
    await Product.update(values,
      {
        where: {
          id: gameId,
        },
      },
    );
    
    const game = await Product.findByPk(gameId);
    
    let gameCurrentCategories = await game.getCategories({attributes: ['id']});
    let gameCurrentExtends = await game.getExtends({attributes: ['id']});
    let gameCurrentLanguages = await game.getLanguages({attributes: ['id']});
    let gameCurrentRegions = await game.getRegions({attributes: ['id']});
  
    gameCurrentCategories.map(item => item.dataValues);
    gameCurrentExtends.map(item => item.dataValues);
    gameCurrentLanguages.map(item => item.dataValues);
    gameCurrentRegions.map(item => item.dataValues);
    
    if (gameCurrentCategories.length) {
      gameCurrentCategories.forEach(item => {
        if (!categories.includes(item) || item !== categories) {
          game.removeCategory(item);
        }
      })
    }
  
    if (gameCurrentExtends.length) {
      gameCurrentExtends.forEach(item => {
        if (!gameExtends.includes(item) || item !== gameExtends) {
          game.removeExtend(item);
        }
      })
    }
  
    if (gameCurrentLanguages.length) {
      gameCurrentLanguages.forEach(item => {
        if (!languages.includes(item) || item !== languages) {
          game.removeLanguage(item);
        }
      })
    }
  
    if (gameCurrentRegions.length) {
      gameCurrentRegions.forEach(item => {
        if (!regions.includes(item) || item !== regions) {
          game.removeRegion(item);
        }
      })
    }
    
    if (categories) {
      let res = [categories];
      
      if (Array.isArray(categories)) {
        res = categories.filter(item => !gameCurrentCategories.includes(item));
      }
    
      game.setCategories(res);
    }
  
    if (gameExtends) {
      let res = [gameExtends];
    
      if (Array.isArray(gameExtends)) {
        res = gameExtends.filter(item => !gameCurrentExtends.includes(item));
      }
    
      game.setExtends(res);
    }
  
    if (languages) {
      let res = [languages];
    
      if (Array.isArray(languages)) {
        res = languages.filter(item => !gameCurrentLanguages.includes(item));
      }
    
      game.setLanguages(res);
    }
  
    if (regions) {
      let res = [regions];
    
      if (Array.isArray(regions)) {
        res = regions.filter(item => !gameCurrentRegions.includes(item));
      }
    
      game.setRegions(res);
    }
  
    res.redirect('/admin/products');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/edit/${gameId}`);
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
  pageEditProduct,
  editProduct,
  pageAddGameKid,
  addGameKid,
  pageAddElementKit,
  addElementKit,
};
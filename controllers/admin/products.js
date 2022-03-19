const uuid = require('uuid');
const path = require('path');
const {
  getExtendFile,
  getArray,
  getAlias,
} = require("../../utils/functions");
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Genre = require('../../models/Genre');
const Extend = require('../../models/Extend');
const Language = require('../../models/Language');
const Region = require('../../models/Region');
const Developer = require('../../models/Developer');
const Publisher = require('../../models/Publisher');
const ActivationService = require('../../models/ActivationService');
const Platform = require('../../models/Platform');
const Edition = require('../../models/Edition');
const Series = require('../../models/Series');

const pageProducts = async (req, res) => {
  try {
    const products = await Product.find().select(['name']);
  
    res.render('listElements', {
      layout: 'admin',
      title: 'Список игр',
      section: 'products',
      elements: products,
      addTitle: "Добавить игру",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

const pageAddProduct = async (req, res) => {
  try {
    const categories = await Category.find().select(['name']);
    const genres = await Genre.find().select(['name']);
    const allExtends = await Extend.find().select(['name']);
    const languages = await Language.find().select(['name']);
    const regions = await Region.find().select(['name']);
    const developers = await Developer.find().select(['name']);
    const publishers = await Publisher.find().select(['name']);
    const activationServices = await ActivationService.find().select(['name']);
    const platforms = await Platform.find().select(['name']);
    const editions = await Edition.find().select(['name']);
    const products = await Product.find().select(['name']);
    const series = await Series.find().select(['name']);
  
    res.render('addProducts', {
      layout: 'admin',
      title: "Добавление новой игры",
      extends: allExtends,
      languages,
      categories,
      genres,
      regions,
      developers,
      publishers,
      activationServices,
      platforms,
      editions,
      products,
      series,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/products');
  }
}

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      priceTo,
      priceFrom,
      trailerLink,
      inHomeSlider,
      dlc,
      dlcForFree,
      dlcForName,
      dlcFor,
      preOrder,
      releaseDate,
      os,
      cpu,
      graphicsCard,
      ram,
      diskMemory,
      categories,
      genres,
      gameExtends,
      languages,
      regions,
      developers,
      series,
      publisher,
      activationService,
      platform,
      edition,
    } = req.body;
    
    const {img, coverImg, coverVideo, gameImages} = req.files;
    const imgExtend = getExtendFile(img.name);
    const imgName = `${uuid.v4()}.${imgExtend}`;
    const creator = req.session.userId;
    const product = new Product({
      name,
      authorId: creator,
      lastEditorId: creator,
      alias: getAlias(name),
      description,
      priceTo,
      priceFrom,
      trailerLink,
      images: [],
      inHomeSlider: inHomeSlider === "on",
      dlc,
      dlcForFree,
      dlcForName,
      preOrder,
      releaseDate,
      os,
      cpu,
      graphicsCard,
      ram,
      diskMemory,
      categories: getArray(categories),
      genres: getArray(genres),
      extends: getArray(gameExtends),
      languages: getArray(languages),
      regions: getArray(regions),
      developers: getArray(developers),
      publisherId: publisher,
      activationServiceId: activationService,
      platformId: platform,
    });
    
    await img.mv(path.resolve(__dirname, '../../uploadedFiles', imgName));
    product.img = imgName;
    
    if (coverImg) {
      const coverImgExtend = getExtendFile(coverImg.name);
      const coverImgName = `${uuid.v4()}.${coverImgExtend}`;
      
      await coverImg.mv(path.resolve(__dirname, '../../uploadedFiles', coverImgName));
      product.coverImg = coverImgName;
    }
  
    if (coverVideo) {
      const coverVideoExtend = getExtendFile(coverVideo.name);
      const coverVideoName = `${uuid.v4()}.${coverVideoExtend}`;
      
      await coverVideo.mv(path.resolve(__dirname, '../../uploadedFiles', coverVideoName));
      product.coverVideo = coverVideoName;
    }
  
    if (gameImages) {
      if (Array.isArray(gameImages)) {
        for (const item of gameImages) {
          const extend = getExtendFile(item.name);
          const gameImgName = `${uuid.v4()}.${extend}`;
        
          await item.mv(path.resolve(__dirname, '../../uploadedFiles', gameImgName));
          product.images.push({name: gameImgName});
        }
      } else {
        const extend = getExtendFile(gameImages.name);
        const gameImgName = `${uuid.v4()}.${extend}`;
      
        await gameImages.mv(path.resolve(__dirname, '../../uploadedFiles', gameImgName));
        product.images.push({name: gameImgName});
      }
    }
    
    if (+dlcFor) {
      product.dlcForId = dlcFor;
    }
    
    if (+edition) {
      product.editionId = edition;
    }
    
    if (+series) {
      product.seriesId = series;
    }
    
    await product.save();
    res.redirect('/admin/products');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/products/add');
  }
}

const pageEditProduct = async (req, res) => {
  const {gameId} = req.params;
  
  try {
    const game = await Product.findByPk(gameId);
  
    const gameCategories = await game.getCategories({attributes: ['id', 'name']});
    const gameGenres = await game.getGenres({attributes: ['id', 'name']});
    const gameExtends = await game.getExtends({attributes: ['id', 'name']});
    const gameLanguages = await game.getLanguages({attributes: ['id', 'name']});
    const gameRegions = await game.getRegions({attributes: ['id', 'name']});
    const gameDevelopers = await game.getDevelopers({attributes: ['id', 'name']});
    const gamePublisher = await game.getPublisher({attributes: ['id', 'name']});
    const gameActivationService = await game.getActivationService({attributes: ['id', 'name']});
    const gamePlatform = await game.getPlatform({attributes: ['id', 'name']});
    const gameEdition = await game.getEdition({attributes: ['id', 'name']});
    const gameImages = await game.getImages({attributes: ['name']});
    const gameElements = await game.getGameElements({
      attributes: ['id', 'name', 'description'],
      order: [['productId', 'DESC']],
      include: {
        model: Product,
        as: 'Entity',
        attributes: ['id', 'name']
      },
    });
  
    const categoryIds = gameCategories.map(item => item.dataValues.id);
    const genreIds = gameGenres.map(item => item.dataValues.id);
    const extentIds = gameExtends.map(item => item.dataValues.id);
    const languageIds = gameLanguages.map(item => item.dataValues.id);
    const regionIds = gameRegions.map(item => item.dataValues.id);
    const developerIds = gameDevelopers.map(item => item.dataValues.id);
    const publisherId = gamePublisher.dataValues.id;
    const activationServiceId = gameActivationService.dataValues.id;
    const platformId = gamePlatform.dataValues.id;
    const editionId = gameEdition.dataValues.id || 0;

    const restCategories = await Category.findAll({
      attributes: ['id', 'name'],
      where: {
        id: {
          [Op.notIn]: [...categoryIds]
        }
      }
    });
  
    const restGenres = await Genre.findAll({
      attributes: ['id', 'name'],
      where: {
        id: {
          [Op.notIn]: [...genreIds]
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
  
    const restDevelopers = await Developer.findAll({
      attributes: ['id', 'name'],
      where: {
        id: {
          [Op.notIn]: [...developerIds]
        }
      }
    });
  
    const restPublishers = await Publisher.findAll({
      attributes: ['id', 'name'],
      where: {
        id: {
          [Op.notIn]: [publisherId]
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
  
    const restPlatforms = await Platform.findAll({
      attributes: ['id', 'name'],
      where: {
        id: {
          [Op.notIn]: [platformId]
        }
      }
    });
  
    const restEditions = await Edition.findAll({
      attributes: ['id', 'name'],
      where: {
        id: {
          [Op.notIn]: [editionId]
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
  
    const genres = [
      ...gameGenres.map(item => {
        return {
          id: item.dataValues.id,
          name: item.dataValues.name,
          selected: true,
        }
      }),
      ...restGenres.map(item => item.dataValues),
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
  
    const developers = [
      ...gameDevelopers.map(item => {
        return {
          id: item.dataValues.id,
          name: item.dataValues.name,
          selected: true,
        }
      }),
      ...restDevelopers.map(item => item.dataValues),
    ];
  
    const publishers = [
      {
        id: gamePublisher.dataValues.id,
        name: gamePublisher.dataValues.name,
        selected: true,
      },
      ...restPublishers.map(item => item.dataValues),
    ];
  
    const activationServices = [
      {
        id: gameActivationService.dataValues.id,
        name: gameActivationService.dataValues.name,
        selected: true,
      },
      ...restActivationServices.map(item => item.dataValues),
    ];
  
    const platforms = [
      {
        id: gamePlatform.dataValues.id,
        name: gamePlatform.dataValues.name,
        selected: true,
      },
      ...restPlatforms.map(item => item.dataValues),
    ];
  
    const editions = [
      ...restEditions.map(item => item.dataValues),
    ];
    
    if (gameEdition) {
      editions.push({
        id: gameEdition.dataValues.id,
        name: gameEdition.dataValues.name,
        selected: true,
      });
    }
  
    res.render('addProducts', {
      layout: 'admin',
      title: "Редактирование игры",
      isEdit: true,
      game: game.dataValues,
      gameImages: gameImages.map(item => item.dataValues),
      gameElements: gameElements.map(item => {
        const dataValues = item.dataValues;
        
        if (!dataValues.Entity) {
          return dataValues;
        }
        
        const gameData = dataValues.Entity.dataValues;
        
        return {
          id: dataValues.id,
          gameId: gameData.id,
          name: gameData.name,
        }
      }),
      categories,
      genres,
      extends: allExtends,
      languages,
      regions,
      developers,
      activationServices,
      publishers,
      platforms,
      editions,
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
      priceTo,
      priceFrom,
      trailerLink,
      inHomeSlider,
      releaseDate,
      os,
      cpu,
      graphicsCard,
      ram,
      diskMemory,
      categories,
      genres,
      gameExtends,
      languages,
      regions,
      developers,
      publisher,
      activationService,
      platform,
      edition,
    } = req.body;
  
    const values = {
      name,
      description,
      priceTo,
      priceFrom,
      trailerLink,
      inHomeSlider: inHomeSlider === "on",
      releaseDate,
      os,
      cpu,
      graphicsCard,
      ram,
      diskMemory,
      publisherId: publisher,
      activationServiceId: activationService,
      platformId: platform,
    }
    
    if (+edition) {
      values.editionId = edition;
    }
    
    const gameImgIds = [];
    
    if (req.files) {
      const {img, coverImg, coverVideo, gameImages} = req.files;
  
      if (img) {
        const extend = getExtendFile(img.name);
        const imgName = `${uuid.v4()}.${extend}`;
        
        await img.mv(path.resolve(__dirname, '../../uploadedFiles', imgName));
        values.img = imgName;
      }
  
      if (coverImg) {
        const extend = getExtendFile(coverImg.name);
        const coverImgName = `${uuid.v4()}.${extend}`;
        
        await coverImg.mv(path.resolve(__dirname, '../../uploadedFiles', coverImgName));
        values.coverImg = coverImgName;
      }
  
      if (coverVideo) {
        const extend = getExtendFile(coverVideo.name);
        const coverVideoName = `${uuid.v4()}.${extend}`;
        
        await coverVideo.mv(path.resolve(__dirname, '../../uploadedFiles', coverVideoName));
        values.coverVideo = coverVideoName;
      }
      
      if (gameImages) {
        if (Array.isArray(gameImages)) {
          for (const item of gameImages) {
            const extend = getExtendFile(item.name);
            const gameImgName = `${uuid.v4()}.${extend}`;
  
            await item.mv(path.resolve(__dirname, '../../uploadedFiles', gameImgName));
            
            const imgObj = await Image.create({name: gameImgName});
  
            gameImgIds.push(imgObj.dataValues.id);
          }
        } else {
          const extend = getExtendFile(gameImages.name);
          const gameImgName = `${uuid.v4()}.${extend}`;
  
          await gameImages.mv(path.resolve(__dirname, '../../uploadedFiles', gameImgName));
  
          const imgObj = await Image.create({name: gameImgName});
  
          gameImgIds.push(imgObj.dataValues.id);
        }
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
    
    await game.addImages(gameImgIds);
    
    let gameCurrentCategories = await game.getCategories({attributes: ['id']});
    let gameCurrentGenres = await game.getGenres({attributes: ['id']});
    let gameCurrentExtends = await game.getExtends({attributes: ['id']});
    let gameCurrentLanguages = await game.getLanguages({attributes: ['id']});
    let gameCurrentRegions = await game.getRegions({attributes: ['id']});
    let gameCurrentDevelopers = await game.getDevelopers({attributes: ['id']});
  
    gameCurrentCategories.map(item => item.dataValues);
    gameCurrentGenres.map(item => item.dataValues);
    gameCurrentExtends.map(item => item.dataValues);
    gameCurrentLanguages.map(item => item.dataValues);
    gameCurrentRegions.map(item => item.dataValues);
    gameCurrentDevelopers.map(item => item.dataValues);
    
    if (gameCurrentCategories.length) {
      gameCurrentCategories.forEach(item => {
        if (!categories.includes(item) || item !== categories) {
          game.removeCategory(item);
        }
      })
    }
  
    if (gameCurrentGenres.length) {
      gameCurrentGenres.forEach(item => {
        if (!genres.includes(item) || item !== genres) {
          game.removeGenre(item);
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
  
    if (gameCurrentDevelopers.length) {
      gameCurrentDevelopers.forEach(item => {
        if (!developers.includes(item) || item !== developers) {
          game.removeDeveloper(item);
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
  
    if (genres) {
      let res = [genres];
    
      if (Array.isArray(genres)) {
        res = genres.filter(item => !gameCurrentGenres.includes(item));
      }
    
      game.setGenres(res);
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
  
    if (developers) {
      let res = [developers];
    
      if (Array.isArray(developers)) {
        res = developers.filter(item => !gameCurrentDevelopers.includes(item));
      }
    
      game.setDevelopers(res);
    }
  
    res.redirect('/admin/products');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/edit/${gameId}`);
    res.json({error: true});
  }
}

const pageAddGameElement = async (req, res) => {
  const {gameId} = req.params;
  
  try {
    const games = await Product.findAll({
      attributes: ['id', 'name'],
      where: {
        id: {
          [Op.notIn]: [gameId],
        }
      }
    });
    
    res.render('addProductElement', {
      layout: 'admin',
      title: 'Добавление элемента к игре',
      games: games.map(item => item.dataValues),
      gameId,
    });
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/edit/${gameId}`);
  }
}

const addGameElement = async (req, res) => {
  const {gameId} = req.params;
  
  try {
    const {name, description, productId} = req.body;
    const game = await Product.findByPk(gameId);
    const values = {
      name,
      description,
    }
    
    if (+productId) {
      values.productId = +productId;
    }
    
    const gameElement = await GameElement.create(values);
    
    await game.addGameElement(gameElement.dataValues.id);
    
    res.redirect(`/admin/products/edit/${gameId}`);
  } catch (e) {
    console.log(e);
    req.redirect(`/admin/products/${gameId}/addElement`);
  }
}

module.exports = {
  pageProducts,
  pageAddProduct,
  addProduct,
  pageEditProduct,
  editProduct,
  pageAddGameElement,
  addGameElement,
};
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import {__dirname} from "../../rootPathes.js";
import Product from './../../models/Product.js';
import Category from './../../models/Category.js';
import Genre from './../../models/Genre.js';
import Extend from './../../models/Extend.js';
import Language from './../../models/Language.js';
import Region from './../../models/Region.js';
import Developer from './../../models/Developer.js';
import Publisher from './../../models/Publisher.js';
import ActivationService from './../../models/ActivationService.js';
import Platform from './../../models/Platform.js';
import Edition from './../../models/Edition.js';
import Series from './../../models/Series.js';
import {
  getExtendFile,
  getArray,
  getAlias, getDiscount, getAllProductParams,
} from "../../utils/functions.js";

export const pageProducts = async (req, res) => {
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

export const pageAddProduct = async (req, res) => {
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

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      dsId,
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
    const imgName = `${uuidv4()}.${imgExtend}`;
    const creator = req.session.userId;
    const product = new Product({
      name,
      authorId: creator,
      lastEditorId: creator,
      alias: getAlias(name),
      description,
      priceTo,
      priceFrom,
      discount: getDiscount(priceTo, priceFrom),
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
    
    await img.mv(path.join(__dirname, '/uploadedFiles', imgName));
    product.img = imgName;
    
    if (coverImg) {
      const coverImgExtend = getExtendFile(coverImg.name);
      const coverImgName = `${uuidv4()}.${coverImgExtend}`;
      
      await coverImg.mv(path.join(__dirname, '/uploadedFiles', coverImgName));
      product.coverImg = coverImgName;
    }
  
    if (coverVideo) {
      const coverVideoExtend = getExtendFile(coverVideo.name);
      const coverVideoName = `${uuidv4()}.${coverVideoExtend}`;
      
      await coverVideo.mv(path.join(__dirname, '/uploadedFiles', coverVideoName));
      product.coverVideo = coverVideoName;
    }
  
    if (gameImages) {
      if (Array.isArray(gameImages)) {
        for (const item of gameImages) {
          const extend = getExtendFile(item.name);
          const gameImgName = `${uuidv4()}.${extend}`;
        
          await item.mv(path.join(__dirname, '/uploadedFiles', gameImgName));
          product.images.push({name: gameImgName});
        }
      } else {
        const extend = getExtendFile(gameImages.name);
        const gameImgName = `${uuidv4()}.${extend}`;
      
        await gameImages.mv(path.join(__dirname, '/uploadedFiles', gameImgName));
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
    
    if (+dsId) {
      product.dsId = dsId;
    }
    
    await product.save();
    res.redirect('/admin/products');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/products/add');
  }
}

export const pageEditProduct = async (req, res) => {
  const {productId} = req.params;
  
  try {
    let product = await Product.findById(productId);

    const restCategories = await Category.find({_id: {$nin: product.categories}}).select('name').lean();
    const restGenres = await Genre.find({_id: {$nin: product.genres}}).select('name').lean();
    const restExtends = await Extend.find({_id: {$nin: product.extends}}).select('name').lean();
    const restLanguages = await Language.find({_id: {$nin: product.languages}}).select('name').lean();
    const restActivationRegions = await Region.find({_id: {$nin: product.activationRegions}}).select('name').lean();
    const restDevelopers = await Developer.find({_id: {$nin: product.developers}}).select('name').lean();
    const restPublishers = await Publisher.find({_id: {$nin: product.publisherId}}).select('name').lean();
    const restActivationServices = await ActivationService.find({_id: {$nin: product.activationServiceId}}).select('name').lean();
    const restPlatforms = await Platform.find({_id: {$nin: product.platformId}}).select('name').lean();
  
    product = await product
      .populate([
        'categories',
        'genres',
        'extends',
        'languages',
        'activationRegions',
        'developers',
        'publisherId',
        'activationServiceId',
        'platformId',
      ]);
    
    const categories = getAllProductParams(product.categories, restCategories);
    const genres = getAllProductParams(product.genres, restGenres);
    const allExtends = getAllProductParams(product.extends, restExtends);
    const languages = getAllProductParams(product.languages, restLanguages);
    const activationRegions = getAllProductParams(product.activationRegions, restActivationRegions);
    const developers = getAllProductParams(product.developers, restDevelopers);
    const publishers = getAllProductParams([product.publisherId], restPublishers);
    const activationServices = getAllProductParams([product.activationServiceId], restActivationServices);
    const platforms = getAllProductParams([product.platformId], restPlatforms);
    
    res.render('addProducts', {
      layout: 'admin',
      title: "Редактирование игры",
      isEdit: true,
      product,
      /*gameImages: gameImages.map(item => item.dataValues),
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
      }),*/
      categories,
      genres,
      extends: allExtends,
      languages,
      activationRegions,
      developers,
      activationServices,
      publishers,
      platforms,
    });
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/`);
    res.json({error: true});
  }
}

export const editProduct = async (req, res) => {
  const {gameId} = req.params;
  
  try {
    const {
      name,
      dsId,
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
        const imgName = `${uuidv4()}.${extend}`;
        
        await img.mv(path.join(__dirname, '/uploadedFiles', imgName));
        values.img = imgName;
      }
  
      if (coverImg) {
        const extend = getExtendFile(coverImg.name);
        const coverImgName = `${uuidv4()}.${extend}`;
        
        await coverImg.mv(path.join(__dirname, '/uploadedFiles', coverImgName));
        values.coverImg = coverImgName;
      }
  
      if (coverVideo) {
        const extend = getExtendFile(coverVideo.name);
        const coverVideoName = `${uuidv4()}.${extend}`;
        
        await coverVideo.mv(path.join(__dirname, '/uploadedFiles', coverVideoName));
        values.coverVideo = coverVideoName;
      }
      
      if (gameImages) {
        if (Array.isArray(gameImages)) {
          for (const item of gameImages) {
            const extend = getExtendFile(item.name);
            const gameImgName = `${uuidv4()}.${extend}`;
  
            await item.mv(path.join(__dirname, '/uploadedFiles', gameImgName));
            
            const imgObj = await Image.create({name: gameImgName});
  
            gameImgIds.push(imgObj.dataValues.id);
          }
        } else {
          const extend = getExtendFile(gameImages.name);
          const gameImgName = `${uuidv4()}.${extend}`;
  
          await gameImages.mv(path.join(__dirname, '/uploadedFiles', gameImgName));
  
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

export const pageAddGameElement = async (req, res) => {
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

export const addGameElement = async (req, res) => {
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
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import {__dirname} from "../../rootPathes.js";
import Product from './../../models/Product.js';
import Category from './../../models/Category.js';
import Genre from './../../models/Genre.js';
import Extend from './../../models/Extend.js';
import Region from './../../models/Region.js';
import Publisher from './../../models/Publisher.js';
import ActivationService from './../../models/ActivationService.js';
import Platform from './../../models/Platform.js';
import Series from './../../models/Series.js';
import {
  getExtendFile,
  getArray,
  getAlias,
  getDiscount,
  mergeParams,
} from "../../utils/functions.js";
import Bundle from "../../models/Bundle.js";
import Edition from "../../models/Edition.js";

export const pageProducts = async (req, res) => {
  try {
    const products = await Product.find().select(['name', 'active']);
  
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
    const regions = await Region.find().select(['name']);
    const publishers = await Publisher.find().select(['name']);
    const activationServices = await ActivationService.find().select(['name']);
    const platforms = await Platform.find().select(['name']);
    const products = await Product.find().select(['name']);
    const series = await Series.find().select(['name']);
    const bundles = await Bundle.find().select(['name']);
    const editions = await Edition.find().select(['name']);
  
    res.render('addProducts', {
      layout: 'admin',
      title: "Добавление новой игры",
      extends: allExtends,
      categories,
      genres,
      regions,
      publishers,
      activationServices,
      platforms,
      products,
      series,
      bundles,
      editions,
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
      metaDescription,
      dsId,
      description,
      priceTo,
      priceFrom,
      trailerLink,
      inHomeSlider,
      inStock,
      dlc,
      dlcForFree,
      dlcForName,
      dlcForId,
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
      activationRegions,
      series,
      bundle,
      edition,
      publisher,
      activationService,
      platform,
      active,
    } = req.body;
    
    const {img, coverImg, coverVideo, gameImages} = req.files;
    const imgExtend = getExtendFile(img.name);
    const imgName = `${uuidv4()}.${imgExtend}`;
    const creator = req.session.userId;
    const product = new Product({
      name,
      metaDescription,
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
      inStock: inStock === 'on',
      dlc: dlc === 'on',
      dlcForFree: dlcForFree === 'on',
      dlcForName,
      preOrder: preOrder === 'on',
      releaseDate,
      os,
      cpu,
      graphicsCard,
      ram,
      diskMemory,
      languages,
      categories: getArray(categories),
      genres: getArray(genres),
      extends: getArray(gameExtends),
      activationRegions: getArray(activationRegions),
      publisherId: publisher,
      activationServiceId: activationService,
      platformId: platform,
      active: active === 'on',
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
    
    if (dlcForId !== '0') {
      product.dlcForId = dlcForId;
    }
    
    if (series !== '0') {
      product.seriesId = series;
    }
    
    if (bundle !== '0') {
      product.bundleId =  bundle;
    }
    
    if (edition !== '0') {
      product.editionId = edition;
    }
    
    if (dsId !== '0') {
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
    const restActivationRegions = await Region.find({_id: {$nin: product.activationRegions}}).select('name').lean();
    const restPublishers = await Publisher.find({_id: {$nin: product.publisherId}}).select('name').lean();
    const restSeries = await Series.find({_id: {$nin: product.seriesId}}).select('name').lean();
    const restBundles = await Bundle.find({_id: {$nin: product.bundleId}}).select('name').lean();
    const restEditions = await Edition.find({_id: {$nin: product.editionId}}).select('name').lean();
    const restActivationServices = await ActivationService.find({_id: {$nin: product.activationServiceId}}).select('name').lean();
    const restPlatforms = await Platform.find({_id: {$nin: product.platformId}}).select('name').lean();
    const restProductsDLC = await Product.find({_id: {$nin: product.dlcForId}}).select('name').lean();
  
    product = await product
      .populate([
        'categories',
        'genres',
        'extends',
        'activationRegions',
        'publisherId',
        'seriesId',
        'bundleId',
        'editionId',
        'activationServiceId',
        'platformId',
        {
          path: 'dlcForId',
          select: ['_id', 'name'],
        }
      ]);
    
    const categories = mergeParams(product.categories, restCategories);
    const genres = mergeParams(product.genres, restGenres);
    const allExtends = mergeParams(product.extends, restExtends);
    const activationRegions = mergeParams(product.activationRegions, restActivationRegions);
    const publishers = mergeParams(product.publisherId, restPublishers);
    const series = mergeParams(product.seriesId, restSeries);
    const bundles = mergeParams(product.bundleId, restBundles);
    const editions = mergeParams(product.editionId, restEditions);
    const activationServices = mergeParams(product.activationServiceId, restActivationServices);
    const platforms = mergeParams(product.platformId, restPlatforms);
    const products = mergeParams(product.dlcForId, restProductsDLC);
    
    res.render('addProducts', {
      layout: 'admin',
      title: "Редактирование игры",
      isEdit: true,
      product,
      products,
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
      activationRegions,
      activationServices,
      publishers,
      series,
      bundles,
      editions,
      platforms,
    });
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/`);
    res.json({error: true});
  }
}

export const editProduct = async (req, res) => {
  const {productId} = req.params;
  
  try {
    const {
      name,
      metaDescription,
      dsId,
      description,
      priceTo,
      priceFrom,
      trailerLink,
      inHomeSlider,
      inStock,
      dlc,
      dlcForFree,
      dlcForName,
      dlcForId,
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
      activationRegions,
      series,
      bundle,
      edition,
      publisher,
      activationService,
      platform,
      active,
    } = req.body;
    const product = await Product.findById(productId);
    const lastEditorId = req.session.userId;
  
    Object.assign(product, {
      name,
      metaDescription,
      lastEditorId,
      alias: getAlias(name),
      description,
      priceTo,
      priceFrom,
      discount: getDiscount(priceTo, priceFrom),
      trailerLink,
      images: [],
      inHomeSlider: inHomeSlider === "on",
      inStock: inStock === 'on',
      dlc: dlc === 'on',
      dlcForFree: dlcForFree === 'on',
      dlcForName,
      preOrder: preOrder === 'on',
      releaseDate,
      os,
      cpu,
      graphicsCard,
      ram,
      diskMemory,
      languages,
      categories: getArray(categories),
      genres: getArray(genres),
      extends: getArray(gameExtends),
      activationRegions: getArray(activationRegions),
      publisherId: publisher,
      activationServiceId: activationService,
      platformId: platform,
      active: active === 'on',
    })
    
    if (req.files) {
      const {
        img = null,
        coverImg = null,
        coverVideo = null,
        gameImages = null,
      } = req.files;
      
      if (img) {
        const imgExtend = getExtendFile(img.name);
        const imgName = `${uuidv4()}.${imgExtend}`;
  
        await img.mv(path.join(__dirname, '/uploadedFiles', imgName));
        product.img = imgName;
      }
  
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
    }
  
    if (dlcForId === '0') {
      product.dlcForId = null;
    } else {
      product.dlcForId = dlcForId;
    }
  
    if (series === '0') {
      product.seriesId = null;
    } else {
      product.seriesId = series;
    }
    
    if (bundle === '0') {
      product.bundleId = null;
    } else {
      product.bundleId = bundle;
    }
    
    if (edition === '0') {
      product.editionId = null
    } else {
      product.editionId = edition;
    }
  
    if (dsId === '0') {
      product.dsId = null;
    } else {
      product.dsId = dsId;
    }
  
    await product.save();
    res.redirect('/admin/products');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/edit/${gameId}`);
    res.json({error: true});
  }
}

export const pageAddProductElement = async (req, res) => {
  const {productId} = req.params;
  
  try {
    const products = await Product.find({_id: {$ne: productId}}).select(['name']).lean();
    
    res.render('addProductElement', {
      layout: 'admin',
      title: 'Добавление элемента к товару',
      products,
      productId,
    });
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/edit/${productId}`);
  }
}

export const addProductElement = async (req, res) => {
  const {productId} = req.params;
  
  try {
    const {name, description, attachProductId} = req.body;
    const product = await Product.findById(productId);
    const element = {
      name,
      description,
    }
    
    if (attachProductId !== '0') {
      element.productId = attachProductId;
    }
    
    product.elements.push({
      $each: [element],
      $sort: {
        productId: -1,
      },
    });
    await product.save();
    
    res.redirect(`/admin/products/edit/${productId}`);
  } catch (e) {
    console.log(e);
    req.redirect(`/admin/products/${productId}/addElement`);
  }
}
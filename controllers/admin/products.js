import cheerio from "cheerio";
import fetch from "node-fetch";
import {v4 as uuidv4} from 'uuid';
import fs from "fs";
import path from 'path';
import Browser from "../../services/Browser.js";

import Product from './../../models/Product.js';
import Category from './../../models/Category.js';
import Genre from './../../models/Genre.js';
import Extend from './../../models/Extend.js';
import Region from './../../models/Region.js';
import Publisher from './../../models/Publisher.js';
import ActivationService from './../../models/ActivationService.js';
import Platform from './../../models/Platform.js';
import Series from './../../models/Series.js';
import Bundle from "../../models/Bundle.js";
import Edition from "../../models/Edition.js";

import {
  getExtendFile,
  getArray,
  getAlias,
  getDiscount,
  mergeParams,
  normalizeStr,
  getSoundIndex,
  getGrams,
} from "../../utils/functions.js";

import {__dirname} from "../../rootPathes.js";
import {strMonths} from "../../utils/constants.js";

export const pageProducts = async (req, res) => {
  try {
    const active = await Product.find({active: true}).select(['name', 'dsId', 'images']).lean();
    const top = await Product.find({top: true}).select(['name', 'active', 'dsId']).lean();
    const other = await Product.find({active: false}).select(['name', 'dsId', 'images']).lean();
    const all = await Product.find().select(['name', 'dsId', 'trailerLink']).lean();
    const trailerProblem = [];
  
    all.forEach(product => {
      if (!product.trailerLink) {
        return trailerProblem.push(product);
      }
      
      if (!product.trailerLink.match(/^https:\/\/www.youtube.com\/watch\?v=([a-zA-Z0-9\-_]+)(?=$)/)) { //https://www.youtube.com/watch?v=oIbcZLcKswU
        trailerProblem.push(product);
      }
    })
  
    function foo(arr, copies) {
      let map = new Map();
      for (let elem of arr) {
        let counter = map.get(elem.name);
        map.set(elem.name, counter ? counter + 1 : 1);
      }
      let res = [];
      for (let [elem, counter] of map.entries())
        if (counter >= copies)
          res.push(elem);
      return res;
    }
    
    const doubles = foo(all, 2);
  
    res.render('admListProducts', {
      layout: 'admin',
      title: 'Список игр',
      active,
      top,
      other,
      doubles,
      trailerProblem,
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
    const recProducts = await Product.find().select(['name']).lean();
  
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
      recProducts,
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
      kupiKodId,
      shortNames,
      sampleH1,
      sampleTitle,
      sampleMetaDescription,
      metaDescription,
      dsId,
      description,
      additionalInfo,
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
      recOs,
      recCpu,
      recGraphicsCard,
      recRam,
      recDiskMemory,
      recommends,
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
      platformType,
      top,
      active,
    } = req.body;
    
    const {img, coverImg, coverVideo, gameImages} = req.files;
    const imgExtend = getExtendFile(img.name);
    const imgName = `${uuidv4()}.${imgExtend}`;
    const creator = req.session.userId;
    const product = new Product({
      name: name.trim(),
      kupiKodId: kupiKodId.trim(),
      sampleH1: sampleH1.trim(),
      sampleTitle: sampleTitle.trim(),
      sampleMetaDescription: sampleMetaDescription.trim(),
      nameGrams: getGrams(name),
      shortNames,
      normalizeName: normalizeStr(name),
      soundName: getSoundIndex(name),
      metaDescription,
      authorId: creator,
      lastEditorId: creator,
      alias: getAlias(name),
      description,
      additionalInfo,
      dsId: dsId || undefined,
      priceTo,
      priceFrom,
      discount: getDiscount(priceTo, priceFrom),
      trailerLink,
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
      recOs,
      recCpu,
      recGraphicsCard,
      recRam,
      recDiskMemory,
      languages,
      recommends: getArray(recommends),
      categories: getArray(categories),
      genres: getArray(genres),
      extends: getArray(gameExtends),
      activationRegions: getArray(activationRegions),
      publisherId: publisher,
      activationServiceId: activationService,
      platformId: platform,
      platformType,
      top: top === 'on',
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

    const restRecommends = await Product.find({_id: {$nin: [...product.recommends, product._id]}}).select('name').lean();
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
        {
          path: 'recommends',
          select: ['name'],
        },
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
        },
        {
          path: 'elements.productId',
          select: ['_id', 'name'],
        }
      ]);
    
    const recProducts = mergeParams(product.recommends, restRecommends);
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
      recProducts,
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
  }
}

export const editProduct = async (req, res) => {
  const {productId} = req.params;
  
  try {
    const {
      name,
      isSaleStock,
      kupiKodId,
      sampleH1,
      sampleTitle,
      sampleMetaDescription,
      shortNames,
      metaDescription,
      dsId,
      description,
      additionalInfo,
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
      recOs,
      recCpu,
      recGraphicsCard,
      recRam,
      recDiskMemory,
      recommends,
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
      platformType,
      top,
      active,
    } = req.body;
    const product = await Product.findById(productId);
    const lastEditorId = req.session.userId;
  
    Object.assign(product, {
      name: name.trim(),
      isSaleStock: isSaleStock === 'on' && product.inStock,
      kupiKodId: kupiKodId.trim(),
      sampleH1: sampleH1.trim(),
      sampleTitle: sampleTitle.trim(),
      sampleMetaDescription: sampleMetaDescription.trim(),
      nameGrams: getGrams(name),
      shortNames,
      normalizeName: normalizeStr(name),
      soundName: getSoundIndex(name),
      metaDescription,
      dsId: dsId || undefined,
      lastEditorId,
      alias: getAlias(name),
      description,
      additionalInfo,
      priceTo,
      priceFrom,
      discount: getDiscount(priceTo, priceFrom),
      trailerLink,
      inHomeSlider: inHomeSlider === "on",
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
      recOs,
      recCpu,
      recGraphicsCard,
      recRam,
      recDiskMemory,
      languages,
      recommends: getArray(recommends),
      categories: getArray(categories),
      genres: genres ? getArray(genres) : product.genres,
      extends: gameExtends ? getArray(gameExtends) : product.extends,
      activationRegions: activationRegions ? getArray(activationRegions) : product.activationRegions,
      publisherId: publisher ? publisher : product.publisherId,
      activationServiceId: activationService ? activationService : product.activationServiceId,
      platformId: platform ? platform : product.platformId,
      platformType: platformType ? platformType : product.platformType,
      top: top === 'on',
      active: active === 'on',
    });
    
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
      product.dlcForId = dlcForId ? dlcForId : product.dlcForId;
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
  
    await product.save();
    
    product.changeInStock(inStock === 'on').then();
    res.redirect('/admin/products');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/edit/${productId}`);
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

export const deleteProductElement = async (req, res) => {
  const {
    productId,
    elementId,
  } = req.params;
  
  try {
    const product = await Product.findById(productId).select('elements');
    
    product.elements.id(elementId).remove();
    product.save();
  
    res.redirect(`/admin/products/edit/${productId}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/edit/${productId}`);
  }
}

export const pageAddProductElements = async (req, res) => {
  const {productId} = req.params;
  
  try {
    res.render('addProductElements', {
      layout: 'admin',
      title: 'Добавление элементов к товару',
      productId,
    });
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/edit/${productId}`);
  }
}

export const addProductElements = async (req, res) => {
  const {productId} = req.params;
  
  try {
    const product = await Product.findById(productId);
    let elements = req.body.elements.split('\n');
    
    elements.forEach(element => {
      product.elements.push({
        name: element.trim(),
        description: element.trim(),
      });
    });
    
    await product.save();
    res.redirect(`/admin/products/edit/${productId}`);
  } catch (e) {
    console.log(e);
    req.redirect(`/admin/products/${productId}/addElement`);
  }
}

export const pageParseBySteambuy = async (req, res) => {
  const {productId} = req.params;
  
  try {
    res.render('admParsingOnLink', {
      layout: 'admin',
      productId,
    });
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/edit/${productId}`);
  }
}

export const parseBySteambuy = async (req, res) => {
  const {productId} = req.params;
  
  try {
    let {
      sourceLink = '',
      values,
    } = req.body;
    
    if (!sourceLink || !values) {
      throw new Error('Not found sourceLink or values');
    }
    
    if (!Array.isArray(values)) {
      values = [values];
    }
    
    const product = await Product
      .findById(productId)
      .select([
        'description',
        'images',
        'trailerLink',
        'releaseDate',
        'genres',
        'extends',
        'publisherId',
        'activationServiceId',
        'activationRegions',
        'languages',
        'os',
        'cpu',
        'graphicsCard',
        'ram',
        'diskMemory',
        'active',
      ]);
    
    if (product.active) {
      return res.redirect(`/admin/products/edit/${productId}`);
    }
  
    const browser = new Browser();
    const productContent = await browser.getPageContent(sourceLink);
    const productNode = cheerio.load(productContent);
    const mediaNodes = productNode('.product-media .product-media__item').toArray();
    let activationName = productNode('.product-price .product-price__activation .product-price__activation-value .product-price__activation-title').text().trim();
    let steamAch;
    let genreNodes;
    let releaseDateStr;
    let publisherName;
    let languages;
    let os;
    let cpu;
    let ram;
    let graphicsCard;
    let diskMemory;
    let playersNodes = [];
    let extendNodes = [];
    let regionNames = [];
    
    productNode('.product-detail .product-detail__section .product-detail__unit').toArray().forEach(detail => {
      const label = productNode(detail).find('.product-detail__label').text();
      const valueNode = productNode(detail).find('.product-detail__value');
      
      switch (label) {
        case 'Жанр:': {
          genreNodes = valueNode.find('.product-detail__value-item a.product-detail__value-link').toArray();
          break;
        }
        case 'Дата выхода:': {
          releaseDateStr = valueNode.first().text().trim();
          break;
        }
        case 'Издатель:': {
          publisherName = valueNode.find('.product-detail__value-item a.product-detail__value-link').first().text().trim();
          break;
        }
        case 'Количество игроков:': {
          playersNodes = valueNode.find('.product-detail__value-item a.product-detail__value-link').toArray();
          break;
        }
        case 'Особенности:': {
          extendNodes = valueNode.find('.product-detail__value-item a.product-detail__value-link').toArray();
          break;
        }
        case 'Достижения Steam:': {
          steamAch = true;
          break;
        }
      }
    })
    productNode('.product-about .product-about__option .product-about__option-unit').toArray().forEach(aboutItem => {
      const label = productNode(aboutItem).find('.product-about__option-label').text().trim();
      const value = productNode(aboutItem).find('.product-about__option-value').text();
      
      switch (label) {
        case 'Активация:': {
          activationName = value.trim();
          break;
        }
        case 'Регион:': {
          regionNames = value.split(', ');
          break;
        }
        case 'Язык:': {
          languages = value.trim();
          break;
        }
      }
    })
    productNode('.product-os .product-os__tabs .os-tabs-content.os-tabs-content_active .os-option__unit').toArray().forEach(systemReq => {
      const label = productNode(systemReq).find('.os-option__label').text().trim();
      const value = productNode(systemReq).find('.os-option__value').text().trim();
  
      switch (label) {
        case 'Система:': {
          os = value;
          break;
        }
        case 'Процессор:': {
          cpu = value;
          break;
        }
        case 'Память:': {
          ram = value;
          break;
        }
        case 'Графика:': {
          graphicsCard = value;
          break;
        }
        case 'Размер:': {
          diskMemory = value;
          break;
        }
      }
    });
    
    for (const value of values) {
      switch (value) {
        case 'description': {
          productNode('.product-desc__article p').each((i, el) => {
            productNode(el).html().split('<br><br>').forEach(p => product.description += `<p>${p}</p>`);
          });
      
          break;
        }
        case 'images': {
          for (const mediaNode of mediaNodes) {
            let el = productNode(mediaNode);
            
            if (el.hasClass('slick-cloned')) {
              continue;
            }
            
            el = el.find('a.product-media__link');
  
            if (el.hasClass('product-media__link_video')) {
              continue;
            }
  
            try {
              const imageUrl = el.attr('href');
              const extend = getExtendFile(imageUrl);
              const productGalleryNameImg = `${uuidv4()}.${extend}`;
              const res = await fetch(imageUrl);
              const fileStream = fs.createWriteStream(path.join(__dirname, `/uploadedFiles/${productGalleryNameImg}`));
    
              await new Promise((resolve, reject) => {
                res.body.pipe(fileStream);
                res.body.on("error", (err) => {
                  reject(err);
                });
                fileStream.on("finish", function () {
                  resolve();
                });
              });
              
              product.images.push({name: productGalleryNameImg});
            } catch (e) {
              console.log(e);
            }
          }
      
          break;
        }
        case 'trailerLink': {
          const node = mediaNodes.find(mediaNode => productNode(mediaNode).find('a.product-media__link').hasClass('product-media__link_video'));
  
          product.trailerLink = 'https://www.youtube.com/watch?v=' + productNode(node).find('a.product-media__link').attr('href').split('/embed/')[1].split('?autoplay=')[0];
          
          break;
        }
        case 'releaseDate': {
          if (releaseDateStr.toLowerCase() === 'уточняется') {
            break;
          }
  
          const dateArr = releaseDateStr.split(' ');
          const monthIndex = strMonths.indexOf(dateArr[1]) + 1;
          let currentDate = new Date();
  
          dateArr[0] = +dateArr[0] < 10 ? '0' + dateArr[0] : '' + dateArr[0];
          dateArr[1] = monthIndex < 10 ? '0' + monthIndex : '' + monthIndex;
  
          const releaseDate = new Date(`${dateArr.reverse().join('-')}T00:00:00.000+00:00`);
  
          currentDate = `${currentDate.getFullYear()}-${currentDate.getMonth() < 9 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1}-${currentDate.getDate() < 9 ? '0' + currentDate.getDate() : currentDate.getDate()}T00:00:00.000+00:00`;
          currentDate = new Date(currentDate);
  
          product.releaseDate = releaseDate;
          product.preOrder = releaseDate >= currentDate;
          
          break;
        }
        case 'genres': {
          const genres = await Genre.find().select(['steamBuyName']).lean();
          
          for (const genreNode of genreNodes) {
            const genreName = productNode(genreNode).text().trim();
            const genre = genres.find(item => item.steamBuyName === genreName);
    
            if (genre) {
              const exists = product.genres.findIndex(item => item.toString() === genre._id.toString()) !== -1;
  
              if (!exists) {
                product.genres.push(genre._id);
              }
              
              continue;
            }
    
            try {
              const newGenre = new Genre({name: genreName, steamBuyName: genreName});
      
              await newGenre.save();
              product.genres.push(newGenre._id);
            } catch (e) {
              console.log(e);
            }
          }
          
          break;
        }
        case 'extends': {
          const extendsItems = await Extend.find().select('steamBuyName').lean();
          
          for (const playersNode of playersNodes) {
            const extendName = productNode(playersNode).text().trim();
            const extend = extendsItems.find(item => item.steamBuyName === extendName);
    
            if (extend) {
              const exists = product.extends.findIndex(item => item.toString() === extend._id.toString()) !== -1;
              
              if (!exists) {
                product.extends.push(extend._id);
              }
              
              continue;
            }
    
            try {
              const newExtend = new Extend({name: extendName, steamBuyName: extendName});
      
              await newExtend.save();
              product.extends.push(newExtend._id);
            } catch (e) {
              console.log(e);
            }
          }
  
          for (const extendNode of extendNodes) {
            const extendName = productNode(extendNode).text().trim();
            const extend = extendsItems.find(item => item.steamBuyName === extendName);
    
            if (extend) {
              const exists = product.extends.findIndex(item => item.toString() === extend._id.toString()) !== -1;
      
              if (!exists) {
                product.extends.push(extend._id);
              }
      
              continue;
            }
    
            try {
              const newExtend = new Extend({name: extendName, steamBuyName: extendName});
      
              await newExtend.save();
              product.extends.push(newExtend._id);
            } catch (e) {
              console.log(e);
            }
          }
          
          if (steamAch) {
            const extendName = 'Достижения Steam';
            const extend = extendsItems.find(item => item.steamBuyName === extendName);
  
            if (extend) {
              const exists = product.extends.findIndex(item => item.toString() === extend._id.toString()) !== -1;
    
              if (!exists) {
                product.extends.push(extend._id);
              }
    
              continue;
            }
  
            try {
              const newExtend = new Extend({name: extendName, steamBuyName: extendName});
    
              await newExtend.save();
              product.extends.push(newExtend._id);
            } catch (e) {
              console.log(e);
            }
          }
          
          break;
        }
        case 'publisherId': {
          const publishers = await Publisher.find().select('steamBuyName').lean();
          
          if (!publisherName.length) {
            break;
          }
  
          const publisher = publishers.find(item => item.steamBuyName === publisherName);
  
          if (publisher) {
            product.publisherId = publisher._id;
            break;
          }
  
          try {
            const newPublisher = new Publisher({name: publisherName, steamBuyName: publisherName});
    
            await newPublisher.save();
            product.publisherId = newPublisher._id;
          } catch (e) {
            console.log(e);
          }
  
          break;
        }
        case 'activationServiceId': {
          if (activationName.length) {
            const activationServices = await ActivationService.find().select('steamBuyName').lean();
            const activationService = activationServices.find(item => item.steamBuyName === activationName);
            
            if (activationService) {
              product.activationServiceId = activationService._id;
              break;
            }
            
            try {
              const newActivationService = new ActivationService({name: activationName, steamBuyName: activationName});
      
              await newActivationService.save();
              product.activationServiceId = newActivationService._id;
            } catch (e) {
              console.log(e);
            }
          }
          
          break;
        }
        case 'activationRegions': {
          const regions = await Region.find().select('steamBuyName').lean();
          
          for (const regionName of regionNames) {
            const region = regions.find(item => item.steamBuyName.toLowerCase() === regionName.toLowerCase());
    
            if (region) {
              product.activationRegions.push(region._id);
              continue;
            }
    
            try {
              const newRegion = new Region({name: regionName, steamBuyName: regionName});
      
              await newRegion.save();
              product.activationRegions.push(newRegion._id);
            } catch (e) {
              console.log(e);
            }
          }
  
          break;
        }
        case 'languages': {
          product.languages = languages;
          break;
        }
        case 'os': {
          if (os) {
            product.os = os;
          }
          
          break;
        }
        case 'cpu': {
          if (cpu) {
            product.cpu = cpu;
          }
    
          break;
        }
        case 'graphicsCard': {
          if (graphicsCard) {
            product.graphicsCard = graphicsCard;
          }
    
          break;
        }
        case 'ram': {
          if (ram) {
            product.ram = ram;
          }
    
          break;
        }
        case 'diskMemory': {
          if (diskMemory) {
            product.diskMemory = diskMemory;
          }
    
          break;
        }
      }
    }
    
    await product.save();
  
    res.redirect(`/admin/products/edit/${productId}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/${productId}/parse-by-steam-buy`);
  }
}

export const comparePricePage = async (req, res) => {
  try {
    const products = await Product.find({countKeys: {$gt: 0}}).select(['name', 'priceTo', 'dsPrice']).lean();
    
    res.render('comparePrice', {
      layout: 'admin',
      products: products.map(product => ({...product, dsPrice: product.dsPrice + product.dsPrice * 0.01 || 0})),
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const deleteSliderImg = async (req, res) => {
  const productId = req.params.productId;
  
  try {
    const imgId = req.params.imgId;
    const product = await Product.findById(productId).select(['images']);
    
    product.images = product.images.filter(img => img._id.toString() !== imgId);
    
    await product.save();
  
    res.redirect(`/admin/products/edit/${productId}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products/edit/${productId}`);
  }
}

export const cloneProduct = async (req, res) => {
  const productId = req.params.productId;
  
  try {
    const targetProduct = await Product.findById(productId).lean();
    const creator = req.session.userId;
    
    const newProduct = new Product({
      name: targetProduct.name + ' - clone',
      sampleH1: targetProduct.sampleH1,
      sampleTitle: targetProduct.sampleTitle,
      sampleMetaDescription: targetProduct.sampleMetaDescription,
      alias: targetProduct.alias + '-clone',
      description: targetProduct.description,
      additionalInfo: targetProduct.additionalInfo,
      priceTo: targetProduct.priceTo,
      priceFrom: targetProduct.priceFrom,
      discount: targetProduct.discount,
      img: targetProduct.img,
      coverImg: targetProduct.coverImg,
      coverVideo: targetProduct.coverVideo,
      trailerLink: targetProduct.trailerLink,
      dlc: targetProduct.dlc,
      dlcForFree: targetProduct.dlcForFree,
      dlcForName: targetProduct.dlcForName,
      preOrder: targetProduct.preOrder,
      releaseDate: targetProduct.releaseDate,
      images: targetProduct.images,
      elements: targetProduct.elements,
      activationServiceId: targetProduct.activationServiceId,
      publisherId: targetProduct.publisherId,
      seriesId: targetProduct.seriesId,
      editionId: targetProduct.editionId,
      authorId: creator,
      lastEditorId: creator,
      platformId: targetProduct.platformId,
      platformType: targetProduct.platformType,
      languages: targetProduct.languages,
      activationRegions: targetProduct.activationRegions,
      categories: targetProduct.categories,
      genres: targetProduct.genres,
      extends: targetProduct.extends,
      darkenCover: targetProduct.darkenCover,
      totalGradeParse: targetProduct.totalGradeParse,
      ratingCountParse: targetProduct.ratingCountParse,
    });
    
    await newProduct.save();
  
    res.redirect(`/admin/products/edit/${ newProduct._id }`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/products`);
  }
}
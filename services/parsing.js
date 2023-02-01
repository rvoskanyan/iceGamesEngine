import fetch from "node-fetch";
import fs from "fs";
import cheerio from "cheerio";
import Product from "../models/Product.js";
import ActivationService from "../models/ActivationService.js";
import Platform from "../models/Platform.js";
import Genre from "../models/Genre.js";
import Publisher from "../models/Publisher.js";
import Extend from "../models/Extend.js";
import Region from "../models/Region.js";
import {getAlias, getDiscount, getExtendFile, getSoundIndex, isEqualBySound, normalizeStr} from "../utils/functions.js";
import {strMonths} from "../utils/constants.js";
import path from "path";
import {__dirname} from "../rootPathes.js";
import {v4 as uuidv4} from "uuid";
import Browser from "./Browser.js";
import Key from "../models/Key.js";

let int;

export const syncPriceAndInStock = async () => {
  clearInterval(int);
  
  int = setInterval(async () => {
    process.env.SYNC = '1';
    await sync();
  }, 1000 * 60 * 60);
  
  process.env.SYNC = '1';
  await sync();
}

const sync = async () => {
  const rows = 2000;
  let page = 1;
  let pages = 1;
  
  while (page <= pages) {
    const responseProducts = await fetch('https://api.digiseller.ru/api/seller-goods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        id_seller: 182844,
        order_col: "name",
        order_dir: "asc",
        currency: "RUR",
        lang: "ru-RU",
        rows,
        page,
      }),
    });
    const resultProducts = await responseProducts.json();
    const products = resultProducts.rows;
    
    pages = resultProducts.pages;
    
    for (const product of products) {
      const inStock = !!product.in_stock;
      const dsId = product.id_goods;
      const priceTo = parseFloat(product.price_rur);
      
      try {
        const productOnSite = await Product.findOne({dsId});
        
        if (!productOnSite) {
          continue;
        }
        
        if (priceTo >= 9999 || productOnSite.preOrder) {
          await productOnSite.changeInStock(false);
          continue;
        }
        
        productOnSite.dsPrice = priceTo;
        await productOnSite.save();
        
        if (productOnSite.countKeys) {
          continue;
        }

        if (Array.isArray(productOnSite.shortNames) || !productOnSite.shortNames) {
          productOnSite.shortNames = '';
        }
        
        productOnSite.priceTo = priceTo;
        productOnSite.discount = getDiscount(priceTo, productOnSite.priceFrom);
        
        await productOnSite.save();
        await productOnSite.changeInStock(inStock);
      } catch (e) {
        console.log(e);
      }
    }
    
    page++;
  }
  
  process.env.SYNC = '';
}

export const startParsingProducts = async () => {
  const rows = 2000;
  let page = 1;
  let pages = 1;
  
  while (page <= pages) {
    const responseProducts = await fetch('https://api.digiseller.ru/api/seller-goods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        id_seller: 182844,
        order_col: "name",
        order_dir: "asc",
        currency: "RUR",
        lang: "ru-RU",
        rows,
        page,
      }),
    });
    const resultProducts = await responseProducts.json();
    const products = resultProducts.rows;
    
    pages = resultProducts.pages;
    
    for (const product of products) {
      const name = product.name_goods;
      
      try {
        const inStock = product.in_stock;
        const dsId = product.id_goods;
        const priceTo = parseFloat(product.price_rur);
        const productOnSite = await Product.findOne({dsId});
  
        if (productOnSite) {
          productOnSite.inStock = inStock;
          productOnSite.priceTo = priceTo;
          productOnSite.name = productOnSite.name.split(' ').map(item => {
            if (item === '-' || item === '--') {
              return '—';
            }
  
            return item;
            
            //return item[0].toUpperCase() + item.slice(1).toLowerCase();
          }).join(' ');
          
          if (!productOnSite.images.length) {
            const browser = new Browser();
            const searchContent = await browser.getPageContent(encodeURI(`https://steambuy.com/catalog/?q=${name}`));
            const searchNode = cheerio.load(searchContent);
            const results = searchNode('a.product-item__title-link');
            let sourceLink;
  
            if (!results || !results.length) {
              const searchContent = await browser.getPageContent(encodeURI(`https://steambuy.com/catalog/?q=${productOnSite.name}`));
              const searchNode = cheerio.load(searchContent);
              const results = searchNode('a.product-item__title-link');
  
              if (results && results.length) {
                for (const item of results) {
                  const itemName = searchNode(item).text();
    
                  if (getAlias(itemName) === getAlias(productOnSite.name) || isEqualBySound(itemName, productOnSite.name)) {
                    sourceLink = `https://steambuy.com${searchNode(item).attr('href')}`;
                    break;
                  }
                }
              }
            } else {
              for (const item of results) {
                const itemName = searchNode(item).text();
    
                if (getAlias(itemName) === getAlias(name) || isEqualBySound(itemName, name)) {
                  sourceLink = `https://steambuy.com${searchNode(item).attr('href')}`;
                  break;
                } else {
                  const searchContent = await browser.getPageContent(encodeURI(`https://steambuy.com/catalog/?q=${productOnSite.name}`));
                  const searchNode = cheerio.load(searchContent);
                  const results = searchNode('a.product-item__title-link');
  
                  if (results && results.length) {
                    for (const item of results) {
                      const itemName = searchNode(item).text();
      
                      if (getAlias(itemName) === getAlias(productOnSite.name) || isEqualBySound(itemName, productOnSite.name)) {
                        sourceLink = `https://steambuy.com${searchNode(item).attr('href')}`;
                        break;
                      }
                    }
                  }
                }
              }
            }
            
            if (sourceLink) {
              const productContent = await browser.getPageContent(sourceLink);
              const productNode = cheerio.load(productContent);
              const mediaNodes = productNode('.product-media .product-media__item a.product-media__link').toArray();
  
              for (const mediaNode of mediaNodes) {
                const el = productNode(mediaNode);
    
                if (!el.hasClass('product-media__link_video')) {
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
                      fileStream.on("finish", function() {
                        resolve();
                      });
                    });
                    productOnSite.images.push({name: productGalleryNameImg});
                  } catch (e) {
                    console.log(e);
                  }
                }
              }
            }
          }
          
          if (!productOnSite.coverImg) {
            const indexCover = Math.floor(Math.random() * (productOnSite.images.length - 1)) + 1;
  
            productOnSite.coverImg = productOnSite.images[indexCover] && productOnSite.images[indexCover].name;
          }
          
          await productOnSite.save();
          //continue;
        }
  
        /*if (!inStock) {
          continue;
        }
  
        const productData = await parseProduct(name, priceTo);

        const newProduct = new Product({
          ...productData,
          dsId,
          inStock: true,
        });
  
        await newProduct.save();*/
      } catch (e) {
        console.log(e);
      }
    }
    
    page++;
  }
  
  process.env.PARSING = '';
}

export async function parseProduct(searchProductName, price, sourceLink = null) {
  const browser = new Browser();
  const product = {
    name: searchProductName,
    alias: getAlias(searchProductName),
    normalizeName: normalizeStr(searchProductName),
    soundName: getSoundIndex(searchProductName),
    priceTo: price,
    priceFrom: price,
    description: '',
    activationRegions: [],
    images: [],
    categories: [],
    genres: [],
    extends: [],
  };
  
  try { //Загрузка главной картинки с https://www.igdb.com/
    const searchIgDb = await browser.getPageContent(encodeURI(`https://www.igdb.com/search?&type=1&q=${searchProductName}`));
    const searchIgDbNode = cheerio.load(searchIgDb);
    const searchIgDbResults = searchIgDbNode('.media .media-body a.link-dark').first();
  
    if (!searchIgDbResults.length) {
      throw new Error();
    }
  
    let name = searchIgDbResults.first().text().trim();
    let productUrl;
  
    name = name.slice(0, -6).trim();
  
    if (getAlias(name) === product.alias || isEqualBySound(name, searchProductName)) {
      productUrl = searchIgDbResults.first().attr('href');
    }
  
    if (!productUrl) {
      throw new Error();
    }
  
    const productIgDb = await browser.getPageContent(`https://www.igdb.com${productUrl}`);
    const productIgDbNode = cheerio.load(productIgDb);
    const productIgDbImg = productIgDbNode('.gamepage-header-info img.img-responsive.cover_big').attr('src');
  
    if (!productIgDbImg) {
      throw new Error();
    }

    const extend = getExtendFile(productIgDbImg);
    const productImg = `${uuidv4()}.${extend}`;
    const res = await fetch(productIgDbImg.includes('https:') ? productIgDbImg : `https:${productIgDbImg}`);
    const fileStream = fs.createWriteStream(path.join(__dirname, `/uploadedFiles/${productImg}`));
  
    if (!productImg) {
      throw new Error();
    }
  
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", (err) => {
        reject(err);
      });
      fileStream.on("finish", function() {
        resolve();
      });
    });
    product.img = productImg;
  } catch (e) {
    console.log(e);
  }
  
  try { //Загрузка материалов с https://steambuy.com/
    if (!sourceLink) {
      const searchContent = await browser.getPageContent(encodeURI(`https://steambuy.com/catalog/?q=${searchProductName}`));
      const searchNode = cheerio.load(searchContent);
      const results = searchNode('a.product-item__title-link');
  
      if (!results || !results.length) {
        throw new Error();
      }
  
      for (const item of results) {
        const itemName = searchNode(item).text();
    
        if (getAlias(itemName) === product.alias || isEqualBySound(itemName, searchProductName)) {
          product.name = itemName;
          product.alias = getAlias(itemName);
          product.normalizeName = normalizeStr(itemName);
          product.soundName = getSoundIndex(itemName);
          sourceLink = `https://steambuy.com${searchNode(item).attr('href')}`;
          break;
        }
      }
    }
  
    if (!sourceLink) {
      throw new Error();
    }
  
    const productContent = await browser.getPageContent(sourceLink);
    const activationServices = await ActivationService.find().select('steamBuyName').lean();
    const platforms = await Platform.find().select('name').lean();
    const genres = await Genre.find().select('steamBuyName').lean();
    const publishers = await Publisher.find().select('steamBuyName').lean();
    const extendsItems = await Extend.find().select('steamBuyName').lean();
    const regions = await Region.find().select('steamBuyName').lean();
    const productNode = cheerio.load(productContent);
    const description = productNode('.product-desc__article p');
    const discount = parseFloat(productNode('.product-price .product-price__discount-cost').first().text());
    const isDlc = productNode('.product-desc .accent_purple .accent__title').text() === 'Дополнительный контент';
    const mediaNodes = productNode('.product-media .product-media__item a.product-media__link').toArray();
    const systemRequirements = productNode('.product-os .product-os__tabs .os-tabs-content.os-tabs-content_active .os-option__unit');
    const productDetails = productNode('.product-detail .product-detail__section .product-detail__unit').toArray();
    const productAbouts = productNode('.product-about .product-about__option .product-about__option-unit').toArray();
    const platformName = 'PC';
    const platform = platforms.find(item => {
      return item.name === platformName;
    });
    let currentMedia = 0;
    let activationName = productNode('.product-price .product-price__activation .product-price__activation-value .product-price__activation-title').text().trim();
  
    description.each((i, el) => {
      product.description += `<p>${productNode(el).text()}</p>`;
    });
  
    systemRequirements.each((i, el) => {
      const label = productNode(el).find('.os-option__label').text();
      const value = productNode(el).find('.os-option__value').text();
    
      switch (label) {
        case 'Система:': {
          product.os = value;
          break;
        }
        case 'Процессор:': {
          product.cpu = value;
          break;
        }
        case 'Память:': {
          product.ram = value;
          break;
        }
        case 'Графика:': {
          product.graphicsCard = value;
          break;
        }
        case 'Размер:': {
          product.diskMemory = value;
          break;
        }
      }
    })
  
    for (const productAbout of productAbouts) {
      const label = productNode(productAbout).find('.product-about__option-label').text();
      const value = productNode(productAbout).find('.product-about__option-value').text();
    
      switch (label) {
        case 'Активация:': {
          activationName = value.trim();
          break;
        }
        case 'Регион:': {
          const regionNames = value.split(', ');
        
          for (const regionName of regionNames) {
            const region = regions.find(item => {
              return item.steamBuyName.toLowerCase() === regionName.toLowerCase();
            });
            
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
        case 'Язык:': {
          product.languages = value;
          break;
        }
      }
    }
  
    for (const mediaNode of mediaNodes) {
      const el = productNode(mediaNode);
    
      if (el.hasClass('product-media__link_video')) {
        product.trailerLink = 'https://www.youtube.com/watch?v=' + el.attr('href').split('/embed/')[1].split('?autoplay=')[0];
      } else {
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
            fileStream.on("finish", function() {
              resolve();
            });
          });
          product.images.push({name: productGalleryNameImg});
        } catch (e) {
          console.log(e);
        }
      }
  
      currentMedia++;
    }
  
    for (const productDetail of productDetails) {
      const label = productNode(productDetail).find('.product-detail__label').text();
      const valueNode = productNode(productDetail).find('.product-detail__value');
    
      switch (label) {
        case 'Жанр:': {
          const genreNodes = valueNode.find('.product-detail__value-item a.product-detail__value-link').toArray();
        
          for (const genreNode of genreNodes) {
            const genreName = productNode(genreNode).text().trim();
            const genre = genres.find(item => {
              return item.steamBuyName === genreName;
            });
            
            if (genre) {
              product.genres.push(genre._id);
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
        case 'Дата выхода:': {
          const date = valueNode.first().text().trim();
          
          if (date.toLowerCase() === 'уточняется') {
            break;
          }
          
          const dateArr = date.split(' ');
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
        case 'Издатель:': {
          const publisherName = valueNode.find('.product-detail__value-item a.product-detail__value-link').first().text().trim();
          
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
        case 'Количество игроков:': {
          const extendNodes = valueNode.find('.product-detail__value-item a.product-detail__value-link').toArray();
        
          for (const extendNode of extendNodes) {
            const extendName = productNode(extendNode).text().trim();
            const extend = extendsItems.find(item => {
              return item.steamBuyName === extendName;
            });
            
            if (extend) {
              product.extends.push(extend._id);
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
        case 'Особенности:': {
          const extendNodes = valueNode.find('.product-detail__value-item a.product-detail__value-link').toArray();
        
          for (const extendNode of extendNodes) {
            const extendName = productNode(extendNode).text().trim();
            const extend = extendsItems.find(item => {
              return item.steamBuyName === extendName;
            });
            
            if (extend) {
              product.extends.push(extend._id);
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
        case 'Достижения Steam:': {
          const extendName = 'Достижения Steam';
          const extend = extendsItems.find(item => {
            return item.steamBuyName === extendName;
          });
          
          if (extend) {
            product.extends.push(extend._id);
            break;
          }
  
          try {
            const newExtend = new Extend({name: extendName, steamBuyName: extendName});
    
            await newExtend.save();
            product.extends.push(newExtend._id);
          } catch (e){
            console.log(e);
          }
          break;
        }
      }
    }
  
    const indexCover = Math.floor(Math.random() * (product.images.length - 1)) + 1;
  
    product.coverImg = product.images[indexCover] && product.images[indexCover].name;
  
    if (activationName.length) {
      const activationService = activationServices.find(item => {
        return item.steamBuyName === activationName;
      })
    
      if (!activationService) {
        try {
          const newActivationService = new ActivationService({name: activationName, steamBuyName: activationName});
  
          await newActivationService.save();
          product.activationServiceId = newActivationService._id;
        } catch (e) {
          console.log(e);
        }
      } else {
        product.activationServiceId = activationService._id;
      }
    }
  
    if (discount) {
      product.priceFrom += discount;
      product.discount = getDiscount(product.priceTo, product.priceFrom);
    }
  
    if (!platform) {
      try {
        const newPlatform = new Platform({name: platformName});
  
        await newPlatform.save();
        product.platformId = newPlatform._id;
      } catch (e) {
        console.log(e);
      }
    } else {
      product.platformId = platform._id;
    }
  
    if (isDlc) {
      const dlcForName = productNode('.product-desc .accent_purple .accent__desc a').text();
    
      product.dlc = true;
      
      if (dlcForName.length) {
        product.dlcForName = dlcForName;
      }
    }
  } catch (e) {
    console.log(e);
  }
  
  return product;
}

export async function syncRating(products, req) {
  req.app.set('syncRating', true);
  const browser = new Browser();
  
  for (const product of products) {
    try {
      const productWebPage = await browser.getPageContent(encodeURI(`https://www.playground.ru/${product.alias.replace(/-/g, '_')}`));
      const productPageNode = cheerio.load(productWebPage);
      const totalGradeParse = productPageNode('.gp-game-info .game-rating-points .value.js-game-rating-value').text().trim();
      const ratingCountParse = productPageNode('.gp-game-info .game-rating-points .js-game-rating-count').text().trim();
  
      if (!totalGradeParse || !ratingCountParse) {
        continue;
      }
  
      product.totalGradeParse = Number.isInteger(+totalGradeParse) ? +`${totalGradeParse}.0` : +totalGradeParse;
      product.ratingCountParse = +ratingCountParse.replace(/\s/g, '');
  
      await product.save();
    } catch (e) {
      console.log(e);
    }
  }
  
  req.app.set('syncRating', false);
}
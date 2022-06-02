import fetch from "node-fetch";
import fs from "fs";
import cheerio from "cheerio";
import Product from "../models/Product.js";
import ParsingTask from "../models/ParsingTask.js";
import ActivationService from "../models/ActivationService.js";
import Platform from "../models/Platform.js";
import Genre from "../models/Genre.js";
import Publisher from "../models/Publisher.js";
import Extend from "../models/Extend.js";
import Region from "../models/Region.js";
import {getAlias, getDiscount, getExtendFile, isEqualBySound} from "../utils/functions.js";
import {strMonths} from "../utils/constants.js";
import path from "path";
import {__dirname} from "../rootPathes.js";
import {v4 as uuidv4} from "uuid";
import Browser from "./Browser.js";

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
          await productOnSite.save();
          continue;
        }
  
        if (!inStock) {
          continue;
        }
  
        const {productData, parsingTaskData} = await parseProduct(name, priceTo);
  
        console.log(productData);

        const newProduct = new Product({
          ...productData,
          dsId,
          inStock: true,
        });
        const newParsingTask = new ParsingTask({
          ...parsingTaskData,
          product: newProduct._id,
        });
  
        await newProduct.save();
        await newParsingTask.save();
      } catch (e) {
        const newParsingTask = new ParsingTask({
          successSaveProduct: false,
          productDsName: name,
        });
        
        await newParsingTask.save();
        console.log(e);
      }
    }
    
    page++;
  }
  
  process.env.PARSING = '';
}

async function parseProduct(searchProductName, price) {
  const browser = new Browser();
  const product = {
    name: searchProductName,
    alias: getAlias(searchProductName),
    priceTo: price,
    priceFrom: price,
    description: '',
    activationRegions: [],
    images: [],
    categories: [],
    genres: [],
    extends: [],
  };
  const parsingTask = {
    productFound: false,
    needFill: [],
  }
  
  try { //Загрузка главной картинки с https://www.igdb.com/
    const searchIgDb = await browser.getPageContent(`https://www.igdb.com/search?&type=1&q=${searchProductName}`);
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
    const productIgDbImg = productIgDbNode('img.img-responsive.cover_big').attr('src');
  
    if (!productIgDbImg) {
      throw new Error();
    }

    const extend = getExtendFile(productIgDbImg);
    const productImg = `${uuidv4()}.${extend}`;
    const res = await fetch(`https:${productIgDbImg}`);
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
  } catch {
    parsingTask.needFill.push('Главная картинка');
  }
  
  try { //Загрузка материалов с https://steambuy.com/
    const searchContent = await browser.getPageContent(`https://steambuy.com/catalog/?q=${searchProductName}`);
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
        parsingTask.sourceLink = `https://steambuy.com${searchNode(item).attr('href')}`;
        break;
      }
    }
  
    if (!parsingTask.sourceLink) {
      throw new Error();
    }
  
    const productContent = await browser.getPageContent(parsingTask.sourceLink);
    const activationServices = await ActivationService.find().select('steamBuyName').lean();
    const platforms = await Platform.find().select('name').lean();
    const genres = await Genre.find().select('steamBuyName').lean();
    const publishers = await Publisher.find().select('steamBuyName').lean();
    const extendsItems = await Extend.find().select('steamBuyName').lean();
    const regions = await Region.find().select('steamBuyName').lean();
    const productNode = cheerio.load(productContent);
    const description = productNode('.product-desc__article p');
    const isGroup = productNode('.product-group .product-group__item').length > 0;
    const discount = parseFloat(productNode('.product-price .product-price__discount-cost').first().text());
    const isDlc = productNode('.product-desc .accent_purple .accent__title').text() === 'Дополнительный контент';
    const mediaNodes = productNode('.product-media .product-media__item a.product-media__link').toArray();
    const indexCover = Math.floor(Math.random() * (mediaNodes.length - 1)) + 1;
    const systemRequirements = productNode('.product-os .product-os__tabs .os-tabs-content.os-tabs-content_active .os-option__unit');
    const productDetails = productNode('.product-detail .product-detail__section .product-detail__unit').toArray();
    const productAbouts = productNode('.product-about .product-about__option .product-about__option-unit').toArray();
    const platformName = 'PC';
    const platform = platforms.find(item => {
      return item.name === platformName;
    });
    let currentMedia = 0;
    let activationName = productNode('.product-price .product-price__activation .product-price__activation-value .product-price__activation-title').text();
  
    parsingTask.productFound = true;
    parsingTask.needFill = ['Игра серии', 'Трейлер с ютуба', 'Состав (при наличии)', 'Название издания (при наличии)', 'Связка (при наличии)'];
  
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
          
            if (!region) {
              try {
                const newRegion = new Region({name: regionName, steamBuyName: regionName});
  
                await newRegion.save();
                regions.push({
                  _id: newRegion._id,
                  steamBuyName: newRegion.steamBuyName,
                });
                product.activationRegions.push(newRegion._id);
              } catch (e) {
                console.log(e);
                parsingTask.needFill.push(`Создать регион ${regionName} и добавить к товару`);
              }
            } else {
              product.activationRegions.push(region._id);
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
          
          if (currentMedia === indexCover) {
            product.coverImg = productGalleryNameImg;
          }
        } catch (e) {
          console.log(e);
          parsingTask.needFill.push(`Загрузить скриншот № ${currentMedia + 1}`);
  
          if (currentMedia === indexCover) {
            parsingTask.needFill.push('Загрузить обложку (cover)');
          }
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
            const genreName = productNode(genreNode).text();
            const genre = genres.find(item => {
              return item.steamBuyName === genreName;
            });
          
            if (!genre) {
              try {
                const newGenre = new Genre({name: genreName, steamBuyName: genreName});
  
                await newGenre.save();
                genres.push({
                  _id: newGenre._id,
                  steamBuyName: newGenre.steamBuyName,
                });
                product.genres.push(newGenre._id);
              } catch (e) {
                console.log(e);
                parsingTask.needFill.push(`Создать жанр ${genreName} и добавить к товару`);
              }
            } else {
              product.genres.push(genre._id);
            }
          }
          break;
        }
        case 'Дата выхода:': {
          const dateArr = valueNode.first().text().trim().split(' ');
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
          const publisherName = valueNode.find('.product-detail__value-item a.product-detail__value-link').first().text();
          const publisher = publishers.find(item => {
            return item.steamBuyName === publisherName;
          });
        
          if (!publisher) {
            try {
              const newPublisher = new Publisher({name: publisherName, steamBuyName: publisherName});
  
              await newPublisher.save();
              publishers.push({
                _id: newPublisher._id,
                steamBuyName: newPublisher.steamBuyName,
              });
              product.publisherId = newPublisher._id;
            } catch (e) {
              console.log(e);
              parsingTask.needFill.push(`Создать издателя ${publisherName} и добавить к товару`);
            }
          } else {
            product.publisherId = publisher._id;
          }
        
          break;
        }
        case 'Количество игроков:': {
          const extendNodes = valueNode.find('.product-detail__value-item a.product-detail__value-link').toArray();
        
          for (const extendNode of extendNodes) {
            const extendName = productNode(extendNode).text();
            let extendId;
          
            const extend = extendsItems.find(item => {
              return item.steamBuyName === extendName;
            });
          
            if (!extend) {
              try {
                const newExtend = new Extend({name: extendName, steamBuyName: extendName});
  
                await newExtend.save();
                extendsItems.push({
                  _id: newExtend._id,
                  steamBuyName: newExtend.steamBuyName,
                });
                extendId = newExtend._id;
              } catch (e) {
                console.log(e);
                parsingTask.needFill.push(`Создать расширение ${extendName} и добавить к товару`);
              }
            } else {
              extendId = extend._id;
            }
          
            product.extends.push(extendId);
          }
          break;
        }
        case 'Особенности:': {
          const extendNodes = valueNode.find('.product-detail__value-item a.product-detail__value-link').toArray();
        
          for (const extendNode of extendNodes) {
            const extendName = productNode(extendNode).text();
            const extend = extendsItems.find(item => {
              return item.steamBuyName === extendName;
            });
          
            if (!extend) {
              try {
                const newExtend = new Extend({name: extendName, steamBuyName: extendName});
  
                await newExtend.save();
                extendsItems.push({
                  _id: newExtend._id,
                  steamBuyName: newExtend.steamBuyName,
                });
                product.extends.push(newExtend._id);
              } catch (e) {
                console.log(e);
                parsingTask.needFill.push(`Создать расширение ${extendName} и добавить к товару`);
              }
            } else {
              product.extends.push(extend._id);
            }
          }
          break;
        }
        case 'Достижения Steam:': {
          const extendName = 'Достижения Steam';
        
          const extend = extendsItems.find(item => {
            return item.steamBuyName === extendName;
          });
        
          if (!extend) {
            try {
              const newExtend = new Extend({name: extendName, steamBuyName: extendName});
  
              await newExtend.save();
              extendsItems.push({
                _id: newExtend._id,
                steamBuyName: newExtend.steamBuyName,
              });
              product.extends.push(newExtend._id);
            } catch (e){
              console.log(e);
              parsingTask.needFill.push(`Создать расширение ${extendName} и добавить к товару`);
            }
          } else {
            product.extends.push(extend._id);
          }
          break;
        }
      }
    }
  
    if (activationName.length) {
      const activationService = activationServices.find(item => {
        return item.steamBuyName === activationName;
      })
    
      if (!activationService) {
        try {
          const newActivationService = new ActivationService({name: activationName, steamBuyName: activationName});
  
          await newActivationService.save();
          activationServices.push({
            _id: newActivationService._id,
            steamBuyName: newActivationService.steamBuyName,
          });
          product.activationServiceId = newActivationService._id;
        } catch (e) {
          console.log(e);
          parsingTask.needFill.push(`Создать сервис активации ${activationName} и добавить к товару`);
        }
      } else {
        product.activationServiceId = activationService._id;
      }
    }
  
    if (isGroup) {
      parsingTask.needFill.push('Цена без скидки');
    } else if (discount) {
      product.priceFrom += discount;
      product.discount = getDiscount(product.priceTo, product.priceFrom);
    }
  
    if (!platform) {
      try {
        const newPlatform = new Platform({name: platformName});
  
        await newPlatform.save();
        platforms.push({
          _id: newPlatform._id,
          name: newPlatform.name,
        });
        product.platformId = newPlatform._id;
      } catch (e) {
        console.log(e);
        parsingTask.needFill.push(`Создать платформу ${platformName} и добавить к товару`);
      }
    } else {
      product.platformId = platform._id;
    }
  
    if (isDlc) {
      const dlcForName = productNode('.product-desc .accent_purple .accent__desc a').text();
    
      product.dlc = true;
      parsingTask.needFill.push('DLC для бесплатной игры');
      parsingTask.needFill.push('DLC для игры, которая есть на сайте');
      parsingTask.needFill.push('DLC для игры, если ее нет на сайте');
      
      if (dlcForName.length) {
        product.dlcForName = dlcForName;
      }
    }
  
    if (!product.description.length) {
      parsingTask.needFill.push('Описание');
    }
  
    if (!product.os) {
      parsingTask.needFill.push('Системные требования - ОС');
    }
  
    if (!product.cpu) {
      parsingTask.needFill.push('Системные требования - Процессор');
    }
  
    if (!product.graphicsCard) {
      parsingTask.needFill.push('Системные требования - Видеокарта');
    }
  
    if (!product.ram) {
      parsingTask.needFill.push('Системные требования - Оперативная память');
    }
  
    if (!product.diskMemory) {
      parsingTask.needFill.push('Системные требования - Место на диске');
    }
  
    if (!product.languages) {
      parsingTask.needFill.push('Языки');
    }
  } catch (e) {
    console.log(e);
  }
  
  return {
    productData: product,
    parsingTaskData: parsingTask,
  }
}
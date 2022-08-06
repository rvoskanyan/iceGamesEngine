import Product from "../../models/Product.js";
import Article from "../../models/Article.js";
import User from "../../models/User.js";
import Genre from "../../models/Genre.js";
import ActivationService from "../../models/ActivationService.js";

import {websiteAddress} from "../../config.js";
import {getFormatDate, getSitemap} from "../../utils/functions.js";

export const indexSitemap = async (req, res) => {
  try {
    const params = [
      {
        url: `${websiteAddress}`,
        changeFreq: 'weekly',
        priority: '1',
      },
      {
        url: `${websiteAddress}cart`,
        changeFreq: 'monthly',
        priority: '0.5',
      },
      {
        url: `${websiteAddress}support`,
        changeFreq: 'monthly',
        priority: '0.5',
      },
      {
        url: `${websiteAddress}payment`,
        changeFreq: 'monthly',
        priority: '0.5',
      },
      {
        url: `${websiteAddress}about`,
        changeFreq: 'about',
        priority: '0.5',
      },
      {
        url: `${websiteAddress}discounts`,
        changeFreq: 'discounts',
        priority: '0.5',
      },
      {
        url: `${websiteAddress}novelty`,
        changeFreq: 'novelty',
        priority: '0.5',
      },
      {
        url: `${websiteAddress}preorders`,
        changeFreq: 'novelty',
        priority: '0.5',
      },
      {
        url: `${websiteAddress}reviews`,
        changeFreq: 'daily',
        priority: '0.5',
      },
    ];
    
    const siteMap = getSitemap(params);
    
    res.set('Content-Type', 'text/xml');
    res.send(siteMap);
  } catch (e) {
    console.log(e);
  }
}

export const catalogSitemap = async (req, res) => {
  try {
    const genres = await Genre.find().select(['alias']).lean();
    const activationServices = await ActivationService.find().select(['alias']).lean();
    const products = await Product
      .find({active: true})
      .sort({createdAt: -1})
      .select(['alias', 'updatedAt', 'createdAt'])
      .lean();
    const params = [{
      url: `${websiteAddress}games`,
      lastMod: getFormatDate(products[0].createdAt, '-', ['y', 'm', 'd']),
      changeFreq: 'weekly',
      priority: '1',
    }];
  
    genres.forEach(genre => {
      params.push({
        url: `${websiteAddress}${genre.alias}`,
        lastMod: getFormatDate(products[0].createdAt, '-', ['y', 'm', 'd']),
        changeFreq: 'monthly',
        priority: '1',
      })
    });
  
    activationServices.forEach(activationService => {
      params.push({
        url: `${websiteAddress}${activationService.alias}`,
        lastMod: getFormatDate(products[0].createdAt, '-', ['y', 'm', 'd']),
        changeFreq: 'monthly',
        priority: '1',
      })
    });
    
    products.forEach(product => {
      params.push({
        url: `${websiteAddress}games/${product.alias}`,
        lastMod: getFormatDate(product.updatedAt, '-', ['y', 'm', 'd']),
        changeFreq: 'monthly',
        priority: '1',
      })
    });
  
    const siteMap = getSitemap(params);
  
    res.set('Content-Type', 'text/xml');
    res.send(siteMap);
  } catch (e) {
    console.log(e);
  }
}

export const blogSitemap = async (req, res) => {
  try {
    const articles = await Article.find({active: true}).sort({createdAt: -1}).select(['alias', 'updatedAt', 'createdAt']).lean();
    const params = [{
      url: `${websiteAddress}blog`,
      lastMod: getFormatDate(articles[0].createdAt, '-', ['y', 'm', 'd']),
      changeFreq: 'weekly',
      priority: '0.9',
    }];
  
    articles.forEach(article => {
      params.push({
        url: `${websiteAddress}blog/${article.alias}`,
        lastMod: getFormatDate(article.updatedAt, '-', ['y', 'm', 'd']),
        changeFreq: 'monthly',
        priority: '0.9',
      })
    });
    
    const siteMap = getSitemap(params);
    
    res.set('Content-Type', 'text/xml');
    res.send(siteMap);
  } catch (e) {
    console.log(e);
  }
}

export const ratingSitemap = async (req, res) => {
  try {
    const users = await User.find({locked: false}).select(['login', 'updatedAt']).lean();
    const params = [{
      url: `${websiteAddress}rating`,
      changeFreq: 'daily',
      priority: '0.8',
    }];
  
    users.forEach(user => {
      params.push({
        url: `${websiteAddress}rating/${user.login}`,
        lastMod: getFormatDate(user.updatedAt, '-', ['y', 'm', 'd']),
        changeFreq: 'monthly',
        priority: '0.8',
      })
    });
    
    const siteMap = getSitemap(params);
    
    res.set('Content-Type', 'text/xml');
    res.send(siteMap);
  } catch (e) {
    console.log(e);
  }
}

export const imagesSitemap = async (req, res) => {
  try {
    const params = [];
    const products = await Product
      .find({active: true})
      .sort({createdAt: -1})
      .select(['alias', 'name', 'img'])
      .lean();
  
    products.forEach(product => {
      params.push({
        url: `${websiteAddress}games/${product.alias}`,
        imgPath: `${websiteAddress}${product.img}`,
        deskImg: `Изображение обложки игры ${product.name}`,
        imgName: `Картинка ${product.name}`,
      })
    });
    
    const siteMap = getSitemap(params, true);
    
    res.set('Content-Type', 'text/xml');
    res.send(siteMap);
  } catch (e) {
    console.log(e);
  }
}
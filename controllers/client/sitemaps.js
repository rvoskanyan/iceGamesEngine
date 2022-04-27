import Product from "../../models/Product.js";
import Article from "../../models/Article.js";
import User from "../../models/User.js";

import {websiteAddress} from "../../config.js";
import {getSitemap} from "../../utils/functions.js";

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
    const products = await Product.find({active: true}).sort({createdAt: -1}).select(['alias', 'updatedAt', 'createdAt']).lean();
    const params = [{
      url: `${websiteAddress}games`,
      lastMod: products[0].createdAt,
      changeFreq: 'weekly',
      priority: '1',
    }];
    
    products.forEach(product => {
      params.push({
        url: `${websiteAddress}games/${product.alias}`,
        lastMod: product.updatedAt,
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
      lastMod: articles[0].createdAt,
      changeFreq: 'weekly',
      priority: '0.9',
    }];
  
    articles.forEach(article => {
      params.push({
        url: `${websiteAddress}blog/${article.alias}`,
        lastMod: article.updatedAt,
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
        lastMod: user.updatedAt,
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
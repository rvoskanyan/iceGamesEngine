import {v4 as uuidv4} from "uuid";
import path from "path";
import {__dirname} from "./../../rootPathes.js";
import Article from '../../models/Article.js';
import Product from '../../models/Product.js';
import {
  getArray,
  getAlias,
  getExtendFile, mergeParams,
} from "./../../utils/functions.js";

export const articlesPage = async (req, res) => {
  try {
    const articles = await Article.find().select(['name']);
  
    res.render('listElements', {
      layout: 'admin',
      title: 'Список записей',
      section: 'articles',
      elements: articles,
      addTitle: "Добавить запись",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const addArticlePage = async (req, res) => {
  try {
    const products = await Product.find().select(['name']);
    
    res.render('addArticle', {
      layout: 'admin',
      title: 'Добавление новой записи в блог',
      products,
    })
  } catch (e) {
    console.log(e);
    res.redirect('/admin/articles');
  }
}

export const addArticle = async (req, res) => {
  try {
    const {name, introText, metaDescription, rightImg, blockColor, type, products, fixed} = req.body;
    const {img, coverImg} = req.files;
    const mustFix = fixed === "on";
    const imgExtend = getExtendFile(img.name);
    const coverImgExtend = getExtendFile(coverImg.name);
    const imgName = `${uuidv4()}.${imgExtend}`;
    const coverImgName = `${uuidv4()}.${coverImgExtend}`;
    const article = new Article({
      name,
      type,
      fixed: mustFix,
      introText,
      metaDescription,
      blockColor,
      img: imgName,
      coverImg: coverImgName,
      rightImg: rightImg === "on",
      alias: getAlias(name),
      products: getArray(products),
      authorId: req.session.userId,
      lastEditorId: req.session.userId,
    });
  
    await img.mv(path.join(__dirname, '/uploadedFiles', imgName));
    await coverImg.mv(path.join(__dirname, '/uploadedFiles', coverImgName));
    
    if (mustFix) {
      await Article.findOneAndUpdate({fixed: true}, {fixed: false});
    }
    
    await article.save();
    
    res.redirect('/admin/articles');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/articles/add');
  }
}

export const editArticlePage = async (req, res) => {
  try {
    let article = await Article.findById(req.params.id);
    const restProducts = await Product.find({_id: {$nin: article.products}}).select(['name']).lean();
    
    article = await article.populate('products', ['name']);
    
    const products = mergeParams(article.products, restProducts);
    
    res.render('addArticle', {
      layout: 'admin',
      title: 'Редактирование записи',
      isEdit: true,
      article,
      products,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/articles');
  }
}

export const editArticle = async (req, res) => {
  const id = req.params.id;
  
  try {
    const {name, introText, metaDescription, rightImg, blockColor, type, products, fixed} = req.body;
    const article = await Article.findById(id);
    const mustFix = fixed === "on";
    
    if (req.files) {
      const {
        img = null,
        coverImg = null,
      } = req.files;
  
      if (img) {
        const imgExtend = getExtendFile(img.name);
        const imgName = `${uuidv4()}.${imgExtend}`;
    
        await img.mv(path.join(__dirname, '/uploadedFiles', imgName));
        article.img = imgName;
      }
  
      if (coverImg) {
        const coverImgExtend = getExtendFile(coverImg.name);
        const coverImgName = `${uuidv4()}.${coverImgExtend}`;
    
        await coverImg.mv(path.join(__dirname, '/uploadedFiles', coverImgName));
        article.coverImg = coverImgName;
      }
    }
    
    Object.assign(article, {
      name,
      alias: getAlias(name),
      introText,
      metaDescription,
      rightImg: rightImg === "on",
      blockColor,
      type,
      mustFix,
      lastEditorId: req.session.userId,
      products,
    });
    
    if (mustFix) {
      await Article.findOneAndUpdate({_id: {$ne: id}, fixed: true}, {fixed: false});
    }
    
    await article.save();
    
    res.redirect('/admin/articles');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/articles/edit/${id}`);
  }
}

export const addBlockPage = (req, res) => {
  res.render('addArticleBlock', {
    layout: 'admin',
    title: 'Добавление контент-блока в запись',
    articleId: req.params.id,
  });
}

export const addBlock = async (req, res) => {
  const id = req.params.id;
  
  try {
    const article = await Article.findById(id);
    const {text, imgPosition} = req.body;
    const block = {text};
    
    if (req.files) {
      const {
        img = null,
      } = req.files;
  
      if (img) {
        const imgExtend = getExtendFile(img.name);
        const imgName = `${uuidv4()}.${imgExtend}`;
    
        await img.mv(path.join(__dirname, '/uploadedFiles', imgName));
    
        block.img = imgName;
        block.imgPosition = imgPosition;
      }
    }
    
    article.blocks.push(block);
    
    await article.save();
    
    res.redirect(`/admin/articles/edit/${id}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/articles/${id}/addBlock`);
  }
}
const Article = require('../../models/Article');
const Product = require('../../models/Product');
const Region = require('../../models/Region');
const {
  getArray,
  getAlias, getExtendFile,
} = require("../../utils/functions");
const uuid = require("uuid");
const path = require("path");

const articlesPage = async (req, res) => {
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

const addArticlePage = async (req, res) => {
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

const addArticle = async (req, res) => {
  try {
    const {name, type, products} = req.body;
    const article = new Article({
      name,
      type,
      alias: getAlias(name),
      products: getArray(products),
      authorId: req.session.userId,
      lastEditorId: req.session.userId,
    });
    
    await article.save();
    
    res.redirect('/admin/articles');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/articles/add');
  }
}

const editArticlePage = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    const products = await Product.find().select(['name']);
    
    const resProducts = products.map(i => {
      let selected = false;
      
      article.products.forEach(j => {
        if (i.id === j.toString()) {
          selected = true;
        }
      })
      
      if (selected) {
        i._doc.selected = true;
      }
      
      return i;
    })
    
    res.render('addArticle', {
      layout: 'admin',
      title: 'Редактирование записи',
      isEdit: true,
      article,
      products: resProducts,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/articles');
  }
}

const editArticle = async (req, res) => {
  const id = req.params.id;
  
  try {
    const {name, type, products} = req.body;
    const article = await Article.findById(id);
    
    article.name = name;
    article.type = type;
    //article.products = products;
    
    await article.save();
    
    res.redirect('/admin/articles');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/article/edit/${id}`);
  }
}

const addBlockPage = (req, res) => {
  res.render('addArticleBlock', {
    layout: 'admin',
    title: 'Добавление контент-блока в запись',
    articleId: req.params.id,
  });
}

const addBlock = async (req, res) => {
  const id = req.params.id;
  
  try {
    const article = await Article.findById(id);
    const {text, imgPosition} = req.body;
    const {img} = req.files;
    const block = {text};
    
    if (img) {
      const imgExtend = getExtendFile(img.name);
      const imgName = `${uuid.v4()}.${imgExtend}`;
  
      await img.mv(path.resolve(__dirname, '../../uploadedFiles', imgName));
      
      block.img = imgName;
      block.imgPosition = imgPosition;
    }
    
    article.blocks.push(block);
    
    await article.save();
    
    res.redirect(`/admin/articles/edit/${id}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/articles/${id}/addBlock`);
  }
}

module.exports = {
  articlesPage,
  addArticlePage,
  addArticle,
  editArticlePage,
  editArticle,
  addBlockPage,
  addBlock,
}
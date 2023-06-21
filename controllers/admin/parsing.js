import {parseProduct, startParsingProducts, syncPriceAndInStock, syncRating} from "../../services/parsing.js";
import ParsingTask from "../../models/ParsingTask.js";
import Product from "../../models/Product.js";

export const parsingPage = (req, res) => {
  res.render('parsing', {
    layout: 'admin',
    parsing: process.env.PARSING,
    sync: process.env.SYNC,
    syncRating: req.app.get('syncRating'),
    syncKupiKod: req.app.get('syncKupiKod'),
  })
}

export const startParsing = (req, res) => {
  startParsingProducts();
  process.env.PARSING = '1';
  res.redirect('/admin/parsing');
}

export const startSyncRating = async (req, res) => {
  try {
    const products = await Product.find({active: true}).select(['alias', 'totalGradeParse', 'ratingCountParse']);
    syncRating(products, req);
    
    res.redirect('/admin/parsing');
  } catch (e) {
    console.log(e);
    req.app.set('syncRating', false);
    res.redirect('/admin/parsing');
  }
}

export const sync = (req, res) => {
  syncPriceAndInStock();
  res.redirect('/admin/parsing');
}

export const tasksPage = async (req, res) => {
  try {
    const id = res.locals.person._id.toString();
    const taskInWork = await ParsingTask.findOne({status: 'inWork', executor: id}).populate('product').lean();
    const completedCount = await ParsingTask.countDocuments({status: 'performed', executor: id});
    
    if (taskInWork) {
      return res.render('listTasks', {
        layout: 'admin',
        taskInWork,
      });
    }
    
    const tasks = await ParsingTask.find({status: 'queue'}).limit(500).populate('product').sort({productFound: -1, createdAt: 1}).lean();
    
    res.render('listTasks', {
      layout: 'admin',
      tasks,
      completedCount,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/parsing');
  }
}

export const tasksInWork = async (req, res) => {
  try {
    const {taskId} = req.body;
    const task = await ParsingTask.findById(taskId);
  
    task.status = 'inWork';
    task.executor = res.locals.person._id;
    
    await task.save();
    res.redirect('/admin/parsing/tasks');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/parsing/tasks');
  }
}

export const tasksRefusal = async (req, res) => {
  try {
    const {taskId} = req.body;
    const task = await ParsingTask.findById(taskId);
    
    task.status = 'queue';
    task.executor = undefined;
    task.byHand = false;
    
    await task.save();
    res.redirect('/admin/parsing/tasks');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/parsing/tasks');
  }
}

export const tasksPerformed = async (req, res) => {
  try {
    const {taskId} = req.body;
    const task = await ParsingTask.findById(taskId);
    
    task.status = 'performed';
    
    await task.save();
    
    res.redirect('/admin/parsing/tasks');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/parsing/tasks');
  }
}

export const tasksParsProduct = async (req, res) => {
  try {
    const {
      dsId = null,
      priceTo = null,
      taskId,
      productName,
      sourceLink,
      byHand,
    } = req.body;
    
    const task = await ParsingTask.findById(taskId);
    let product;
    
    if (byHand) {
      task.byHand = true;
      await task.save();
      
      return res.redirect('/admin/parsing/tasks');
    }
    
    if (task.successSaveProduct) {
      product = await Product.findById(task.product);
    } else {
      product = new Product({priceTo, dsId});
    }
    
    const productData = await parseProduct(productName, product.priceTo, sourceLink);
  
    Object.assign(product, productData);
  
    task.successSaveProduct = true;
    task.product = product._id;
    
    await product.save();
    await task.save();
  
    res.redirect('/admin/parsing/tasks');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/parsing/tasks');
  }
}
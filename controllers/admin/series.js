import Series from './../../models/Series.js';
import Product from './../../models/Product.js';

export const pageSeries = async (req, res) => {
  try {
    const series = await Series.find().select(['name']);
  
    res.render('listElements', {
      layout: 'admin',
      title: 'Список серий игр',
      section: 'series',
      elements: series,
      addTitle: "Добавить серию",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const pageAddSeries = async (req, res) => {
  res.render('addSeries', {
    layout: 'admin',
    title: 'Добавление серии игр',
  })
}

export const addSeries = async (req, res) => {
  try {
    const {name} = req.body;
    
    await Series.create({name});
    
    res.redirect('/admin/series');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/series/add');
  }
}

export const pageEditSeries = async (req, res) => {
  try {
    const {seriesId} = req.params;
    const series = await Series.findById(seriesId);
    const seriesProducts = await Product.find({seriesId});
    
    res.render('addSeries', {
      layout: 'admin',
      title: 'Редактирование серии игр',
      isEdit: true,
      series,
      seriesProducts,
    })
  } catch (e) {
    console.log(e);
    res.redirect('/admin/series');
  }
}

export const editSeries = async (req, res) => {
  const {seriesId} = req.params;
  
  try {
    const {name} = req.body;
    
    await Series.update({name}, {
      where: {
        id: seriesId,
      }
    })
    
    res.redirect('/admin/series');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/series/edit/${seriesId}`);
  }
}

export const pageAddGameSeries = async (req, res) => {
  const {seriesId} = req.params;
  
  try {
    const products = await Product.find({seriesId: null});
    
    res.render('addGameSeries', {
      layout: 'admin',
      title: 'Добавление игры в серию',
      products,
      seriesId,
    });
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/series/edit/${seriesId}`);
  }
}

export const addGameSeries = async (req, res) => {
  const {seriesId} = req.params;
  
  try {
    const {productId} = req.body;
    const product = await Product.findById(productId);
    
    product.seriesId = seriesId;
    
    await product.save();
    
    res.redirect(`/admin/series/edit/${seriesId}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/series/${seriesId}/addGame`);
  }
}
import Series from './../../models/Series.js';

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
    
    const series = await Series.findByPk(seriesId, {attributes: ['id', 'name']});
    const gamesSeries = await series.getProducts({attributes: ['id', 'name']});
    
    res.render('addSeries', {
      layout: 'admin',
      title: 'Редактирование серии игр',
      isEdit: true,
      series: series.dataValues,
      gamesSeries: gamesSeries.map(item => item.dataValues),
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
    const games = await Product.findAll({
      attributes: ['id', 'name'],
      where: {
        seriesId: null,
      }
    });
    
    res.render('addGameSeries', {
      layout: 'admin',
      title: 'Добавление игры в серию',
      games: games.map(item => item.dataValues),
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
    const {gameId} = req.body;
    
    await Product.update({seriesId}, {
      where: {
        id: gameId,
      }
    });
    
    res.redirect(`/admin/series/edit/${seriesId}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/series/${seriesId}/addGame`);
  }
}
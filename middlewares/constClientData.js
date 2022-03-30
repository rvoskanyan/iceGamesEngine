const Category = require('../models/Category');
const Genre = require('../models/Genre');
const Publisher = require('../models/Publisher');
const Developer = require('../models/Developer');

module.exports = async (req, res, next) => {
  res.locals = {
    ...res.locals,
    allCategories: await Category.find().select(['name']),
    allPublishers: await Publisher.find().select(['name']),
    allDevelopers: await Developer.find().select(['name']),
    allGenres: await Genre.find().select(['name']),
  }
  
  next();
}
import Category from '../models/Category.js';
import Genre from '../models/Genre.js';
import Publisher from '../models/Publisher.js';
import Developer from '../models/Developer.js';

export default async (req, res, next) => {
  res.locals = {
    ...res.locals,
    allCategories: await Category.find().select(['name']),
    allPublishers: await Publisher.find().select(['name']),
    allDevelopers: await Developer.find().select(['name']),
    allGenres: await Genre.find().select(['name']),
  }
  
  next();
}
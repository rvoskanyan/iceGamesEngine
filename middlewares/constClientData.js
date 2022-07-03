import Genre from '../models/Genre.js';
import ActivationService from '../models/ActivationService.js';
import Category from '../models/Category.js';

export default async (req, res, next) => {
  res.locals = {
    ...res.locals,
    allActivationServices: await ActivationService.find().select(['name']).lean(),
    allGenres: await Genre.find().select(['name']).lean(),
    allCategories: await Category.find().select(['name']).lean(),
  }
  
  next();
}
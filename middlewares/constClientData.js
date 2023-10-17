import Genre from '../models/Genre.js';
import Product from '../models/Product.js';
import ActivationService from '../models/ActivationService.js';
import Category from '../models/Category.js';

export default async (req, res, next) => {
  const platform = req.platform || 'pc';
  
  const allGenres = await Genre.find().select(['name', 'alias']).lean();
  const filteredGenres = [];
  
  for (const genre of allGenres) {
    const countProducts = await Product.countDocuments({ platformType: platform, genres: { $in: [genre._id] } });
    
    if (countProducts > 0) {
      filteredGenres.push(genre);
    }
  }
  
  const allActivationServices = await ActivationService.find().select(['name', 'alias']).lean();
  const filteredActivationServices = [];
  
  for (const activationService of allActivationServices) {
    const countProducts = await Product.countDocuments({ platformType: platform, activationServiceId: activationService._id });
    
    if (countProducts > 0) {
      filteredActivationServices.push(activationService);
    }
  }
  
  const allCategories = await Category.find().select(['name', 'alias']).lean();
  const filteredCategories = [];
  
  for (const category of allCategories) {
    const countProducts = await Product.countDocuments({ platformType: platform, categories: { $in: [category._id] } });
    
    if (countProducts > 0) {
      filteredCategories.push(category);
    }
  }
  
  res.locals = {
    ...res.locals,
    allActivationServices: filteredActivationServices,
    allGenres: filteredGenres,
    allCategories: filteredCategories,
  }
  
  next();
}
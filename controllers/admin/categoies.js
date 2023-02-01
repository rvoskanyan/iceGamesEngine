import Category from './../../models/Category.js';
import Product from "../../models/Product.js";
import ProductCategory from "../../models/Product_Category.js";

export const pageCategories = async (req, res) => {
  try {
    const categories = await Category.find().select(['name']).lean();
  
    res.render('listElements', {
      layout: 'admin',
      title: 'Список категорий',
      section: 'categories',
      elements: categories,
      addTitle: "Добавить категорию",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const pageAddCategories = async (req, res) => {
  res.render('addCategories', {layout: 'admin'});
}

export const addCategories = async (req, res) => {
  try {
    const {name, alias} = req.body;
    const category = new Category({name, alias});
    
    await category.save();
    
    res.redirect('/admin/categories');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/categories/add');
  }
}

export const pageEditCategory = async (req, res) => {
  try {
    const {categoryId} = req.params;
    const category = await Category.findById(categoryId);
    const products = await ProductCategory.find({category: categoryId}).populate({
      path: 'product',
      select: ['name'],
    }).select(['product', 'order']).sort({order: 1, createdAt: -1}).lean();
  
    res.render('addCategories', {
      layout: 'admin',
      isEdit: true,
      category,
      products,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/categories/add');
  }
}

export const editCategory = async (req, res) => {
  const {categoryId} = req.params;
  
  try {
    const {name, alias} = req.body;
    const category = await Category.findById(categoryId);
  
    category.name = name;
    category.alias = alias;
    
    await category.save();
    
    res.redirect('/admin/categories');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/categories/edit/${categoryId}`);
  }
}

export const pageAddProductCategory = async (req, res) => {
  const {categoryId} = req.params;
  
  try {
    const products = await Product.find({active: true}).select(['name']).lean();
    
    res.render('addProductCategory', {
      layout: 'admin',
      products,
      categoryId,
    });
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/categories/edit/${categoryId}`);
  }
}

export const addProductCategory = async (req, res) => {
  const {categoryId} = req.params;
  
  try {
    const {productId = undefined, order = undefined} = req.body;
    
    if (!productId) {
      throw new Error('No product id');
    }
  
    const category = await Category.findById(categoryId).select(['_id']).lean();
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    const product = await Product.findById(productId).select(['_id']).lean();
  
    if (!product) {
      throw new Error('Product not found');
    }
    
    const productCategoryExists = await ProductCategory.findOne({product: productId, category: categoryId}).select(['_id']).lean();
  
    if (productCategoryExists) {
      throw new Error('This product category exists');
    }
    
    const productCategory = new ProductCategory({
      product: productId,
      category: categoryId,
      order,
    });
    
    await productCategory.save();
  
    res.redirect(`/admin/categories/edit/${categoryId}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/categories/${categoryId}/addProduct`);
  }
}
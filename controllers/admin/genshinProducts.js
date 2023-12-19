import Genshin from './../../models/Genshin.js';
import fetch from "node-fetch";

export const pageGenshinProducts = async (req, res) => {
  try {
    const response = await fetch('https://genshin-pay.kupikod.com/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/8.1.0',
        'accept': 'application/json',
        'token': 'cc00453a85e8911a715c961d6067e364',
      }
    });

    if (!response.ok) {
      console.log(response.status)
    }

    const data = await response.json();

    Genshin.products = data.data;

    // await Genshin.save();

    console.log(data)

    const genshin = await Genshin.find().select(['products']).lean();

    res.render('listElements', {
      layout: 'admin',
      title: 'Список продуктов Genshin',
      section: 'genshin',
      elements: genshin,
      addTitle: "Добавить продукт",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const pageAddGenshinProduct = async (req, res) => {
  res.render('addGenshinProduct', {layout: 'admin'});
}

export const addGenshinProduct = async (req, res) => {
  try {
    const {name, alias} = req.body;
    const genshin = new Genshin({name, alias});

    await genshin.save();

    res.redirect('/admin/genshin');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/genshin/add');
  }
}

export const pageEditGenshinProduct = async (req, res) => {
  try {
    const {categoryId} = req.params;
    const category = await Genshin.findById(categoryId);
    const products = await ProductGenshin.find({category: categoryId}).populate({
      path: 'product',
      select: ['name'],
    }).select(['product', 'order']).sort({order: 1, createdAt: -1}).lean();

    res.render('addGenshin', {
      layout: 'admin',
      isEdit: true,
      category,
      products,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/genshin/add');
  }
}

export const editGenshinProduct = async (req, res) => {
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

export const getGenshinProducts = async (req, res) => {
  try {

    const response = await fetch('https://genshin-pay.kupikod.com/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/8.1.0',
        'accept': 'application/json',
        'token': 'cc00453a85e8911a715c961d6067e364',
      }
    });

    if (!response.ok) {
      // fillUp.codeOrderError = response.status;
      // fillUp.status = 'createOrderError';
      //
      // return await fillUp.save();
    }

    const data = await response.json();

    Genshin.products = data.data;

    await Genshin.save();

  } catch (e) {
    console.log(e);
    res.status(500).json({err: true, message: e});
  }
}

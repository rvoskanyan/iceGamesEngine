import Genshin from './../../models/Genshin.js';
import fetch from "node-fetch";

export const pageGenshinProducts = async (req, res) => {
  try {
    const genshin = await Genshin.find().select(['name']).lean();

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
  res.render('addGenshinProduct', {
    layout: 'admin',
    remoteGenshinProducts: await getRemoteGenshinProducts(),
  });
}

export const addGenshinProduct = async (req, res) => {
  try {
    await Genshin.create({
      name: req.body.name,
      productID: req.body.product,
      price: req.body.price,
    });

    res.redirect('/admin/genshin');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/genshin/add');
  }
}

export const pageEditGenshinProduct = async (req, res) => {
  try {
    const {productId} = req.params;
    const product = await Genshin.findById(productId);

    res.render('addGenshinProduct', {
      layout: 'admin',
      isEdit: true,
      product,
      remoteGenshinProducts: await getRemoteGenshinProducts(),
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/genshin');
  }
}

export const editGenshinProduct = async (req, res) => {
  const {productId} = req.params;

  try {
    const product = await Genshin.findById(productId);

    product.name = req.body.name;
    product.productID = req.body.product;
    product.price = req.body.price;

    await product.save();

    res.redirect('/admin/genshin');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/genshin/edit/${productId}`);
  }
}

export const deleteGenshinProduct = async (req, res) => {
  const {productId} = req.params;

  try {
    await Genshin.findByIdAndDelete(productId);
  } catch (e) {
    console.log(e);
  }

  res.redirect('/admin/genshin');
}

async function getRemoteGenshinProducts() {
  const response = await fetch('https://genshin-pay.kupikod.com/api/products', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'insomnia/8.1.0',
      'accept': 'application/json',
      'token': 'cc00453a85e8911a715c961d6067e364',
    }
  });

  const data = await response.json();

  return data.data
}
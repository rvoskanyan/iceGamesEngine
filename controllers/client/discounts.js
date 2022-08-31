import Product from "./../../models/Product.js";

export const discountsPage = async (req, res) => {
  try {
    const person = res.locals.person;
    let products = await Product.find()
      .find({discount: {$gt: 60}, active: true})
      .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dsId', 'dlc', 'inStock'])
      .sort({'priceFrom': -1})
      .limit(14)
      .lean();
  
    if (person) {
      const favoritesProducts = person.favoritesProducts;
      const cart = person.cart;
    
      products = products.map(item => {
        const productId = item._id.toString();
        
        if (favoritesProducts && favoritesProducts.includes(productId)) {
          item.inFavorites = true;
        }
      
        if (cart && cart.includes(productId)) {
          item.inCart = true;
        }
      
        return item;
      });
    }
    
    res.render('selection', {
      title: 'Скидки — ICE GAMES',
      metaDescription: 'Не упустите шанс купить лучшие игры со скидками. Раздел с самыми выгодными предложениями в магазине лицензионных ключей ICE GAMES.',
      isDiscounts: true,
      selectionName: 'Скидки',
      sort: 'discount',
      breadcrumbs: [{
        name: 'Скидки',
        current: true,
      }],
      products,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
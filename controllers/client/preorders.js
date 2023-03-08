import Product from "./../../models/Product.js";

export const preordersPage = async (req, res) => {
  try {
    const person = res.locals.person;
    let products = await Product.find({preOrder: true, active: true})
      .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dsId', 'dlc', 'inStock', 'preOrder'])
      .limit(8)
      .lean();
    
    if (person) {
      const favoritesProducts = person.favoritesProducts;
      const cart = person.cart;
      
      products = products.map(item => {
        const productId = item._id.toString()
        
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
      title: 'ICE GAMES — Скоро',
      metaDescription: 'Подборка игр для предзаказа от ICE Games',
      ogPath: 'preorders',
      isPreorders: true,
      selectionName: 'Скоро',
      breadcrumbs: [{
        name: 'Скоро',
        current: true,
      }],
      products,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
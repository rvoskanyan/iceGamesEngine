import Product from "./../../models/Product.js";

export const preordersPage = async (req, res) => {
  try {
    const person = res.locals.person;
    let products = await Product.find({preOrder: true})
      .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dsId', 'dlc', 'inStock'])
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
      title: 'ICE GAMES — Предзаказы',
      metaDescription: 'Подборка игр для предзаказа от ICE Games',
      ogPath: 'preorders',
      isPreorders: true,
      selectionName: 'Предзаказы',
      breadcrumbs: [{
        name: 'Предзаказы',
        current: true,
      }],
      products,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
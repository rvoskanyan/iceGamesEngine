import Product from "./../../models/Product.js";

export const preordersPage = async (req, res) => {
  try {
    const person = res.locals.person;
    let products = await Product.find({preOrder: true})
      .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dsId', 'dlc'])
      .limit(8)
      .lean();
    
    if (person) {
      const favoritesProducts = person.favoritesProducts;
      const cart = person.cart;
      
      products = products.map(item => {
        if (favoritesProducts && favoritesProducts.includes(item._id.toString())) {
          item.inFavorites = true;
        }
        
        if (cart && cart.includes(item._id.toString())) {
          item.inCart = true;
        }
        
        return item;
      });
    }
    
    res.render('selection', {
      title: 'ICE Games -- Предзаказы',
      metaDescription: 'Подборка игр для предзаказа от ICE Games',
      isPreorders: true,
      selectionName: 'Предзаказы',
      products,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
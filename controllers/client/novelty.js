import Product from "./../../models/Product.js";

export const noveltyPage = async (req, res) => {
  try {
    const person = res.locals.person;
    let products = await Product
      .find({active: true})
      .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dsId', 'dlc', 'inStock'])
      .sort({'releaseDate': -1})
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
      title: 'ICE Games — Новинки',
      metaDescription: 'Подборка лучших новинок от ICE Games',
      isNovelty: true,
      selectionName: 'Новинки',
      sort: 'date',
      products,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
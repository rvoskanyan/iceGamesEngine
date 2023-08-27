import Product from "./../../models/Product.js";

export const noveltyPage = async (req, res) => {
  try {
    const platform = req.cookies.platform || 'pc';
    const person = res.locals.person;
    let products = await Product
      .find({active: true, platformType: platform})
      .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dsId', 'dlc', 'inStock', 'preOrder'])
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
    
    res.render('section', {
      title: 'Новинки в каталоге ICE GAMES',
      metaDescription: 'Лучшие игровые новинки в магазине ICE GAMES! Здесь можно купить новые ключи для Steam и других платформ по выгодной цене.',
      ogPath: 'novelty',
      isNovelty: true,
      selectionName: 'Новинки',
      sort: 'date',
      breadcrumbs: [{
        name: 'Новинки',
        current: true,
      }],
      products,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
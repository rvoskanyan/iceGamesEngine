import Genre from "../../models/Genre.js";
import Product from "../../models/Product.js";
import ActivationService from "../../models/ActivationService.js";

export const pageSplitCatalog = async (req, res, next) => {
  try {
    const alias = req.params.alias;
    let section = await Genre.findOne({alias}).select(['name']).lean();
    let sectionType = 'genres';
    
    if (!section) {
      section = await ActivationService.findOne({alias}).select(['name']).lean();
      sectionType = 'activationServices';
    }
    
    if (!section) {
      next();
    }
  
    let filter;
    let metaDescription;
    let title;
    let hTitle;
    
    switch (sectionType) {
      case 'genres': {
        filter = {genres: {$in: section._id}};
        metaDescription = `Здесь Вы можете выбрать и купить игры в жанре ${section.name} со скидкой`;
        title = `ICE GAMES — игры в жанре ${section.name}`;
        hTitle = `Купить ${section.name} игры дешево для PC`;
        break;
      }
      case 'activationServices': {
        filter = {activationServiceId: section._id};
        metaDescription = `Здесь Вы можете выбрать и купить игры с активацией в ${section.name} со скидкой`;
        title = `ICE GAMES — игры с активацией в ${section.name}`;
        hTitle = `Купить ключи активации ${section.name} дешево`;
        break;
      }
      default: next();
    }
    
    let {page = 1} = req.query;
    const person = res.locals.person;
    const countOnPage = 14;
    const countProducts = await Product.countDocuments({active: true, ...filter});
    const countPages = Math.ceil(countProducts / countOnPage);
  
    page = Math.floor(page) < 1 ? 1 : Math.floor(page);
    page = page > countPages ? countPages : page;

    const pagination = [{
      path: `${res.locals.websiteAddress}${alias}?page=1`,
      value: 1,
      active: page === 1,
    }];
    
    if (countPages < 8) {
      if (countPages > 1) {
        for (let i = 2; i <= countPages; i++) {
          pagination.push({
            path: `${res.locals.websiteAddress}${alias}?page=${i}`,
            value: i,
            active: page === i,
          })
        }
      }
    } else {
      if (page < 5) {
        for (let i = 2; i < 6; i++) {
          pagination.push({
            path: `${res.locals.websiteAddress}${alias}?page=${i}`,
            value: i,
            active: page === i,
          })
        }
    
        pagination.push({separator: true})
      } else {
        pagination.push({separator: true})
    
        if (countPages - 3 > page) {
          for (let i = -1; i <= 1; i++) {
            pagination.push({
              path: `${res.locals.websiteAddress}${alias}?page=${page + i}`,
              value: page + i,
              active: i === 0,
            });
          }
      
          pagination.push({separator: true})
        } else {
          for (let i = countPages - 4; i < countPages; i++) {
            pagination.push({
              path: `${res.locals.websiteAddress}${alias}?page=${i}`,
              value: i,
              active: page === i,
            });
          }
        }
      }
  
      pagination.push({
        path: `${res.locals.websiteAddress}${alias}?page=${countPages}`,
        value: countPages,
        active: page === countPages,
      });
    }
    
    let products = await Product
      .find({active: true, ...filter})
      .limit(countOnPage)
      .skip((page - 1) * countOnPage)
      .sort({priceTo: -1, createdAt: -1})
      .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'inStock'])
      .lean();
    
    if (person) {
      const favoritesProducts = person.favoritesProducts;
      const cart = person.cart;
  
      products = products && products.map(product => {
        const productId = product._id.toString();
    
        if (favoritesProducts && favoritesProducts.includes(productId)) {
          product.inFavorites = true;
        }
    
        if (cart && cart.includes(productId)) {
          product.inCart = true;
        }
    
        return product;
      });
    }
    
    res.render('splitCatalog', {
      title,
      metaDescription,
      hTitle,
      section,
      products,
      sectionType,
      pagination,
    });
  } catch (e) {
    console.log(e);
  }
}
import fetch from "node-fetch";

import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
import Genre from '../../models/Genre.js';
import ActivationService from '../../models/ActivationService.js';
import Order from '../../models/Order.js';
import Comment from '../../models/Comment.js';
import User from '../../models/User.js';
import Review from "../../models/Review.js";
import Article from "../../models/Article.js";
import {getAlias, getChangeLayout, getGrams, toRoman} from "../../utils/functions.js";

export const gamesPage = async (req, res, next) => {
  try {
    let {
      searchString = '',
      priceFrom = '',
      priceTo = '',
      sort = '',
      onlyStock = '',
      categories = [],
      genres = [],
      activationServices = [],
      page = 1,
    } = req.query;
  
    categories = Array.isArray(categories) ? categories : [categories];
    genres = Array.isArray(genres) ? genres : [genres];
    activationServices = Array.isArray(activationServices) ? activationServices : [activationServices];
    
    const sectionName = req.params.sectionName;
  
    let section;
    let sectionType;
    let metaDescription = `Каталог лучших игр со скидками и удобным поиском. Топ продаж от магазина лицензионных ключей ICE GAMES. Страница ${page}`;
    let title = `Каталог игр для ПК: купить ключи активации со скидкой в магазине ICE GAMES — страница ${page}`;
    let hTitle = `Каталог игр`;
    let pageDescription = `
      <h2>Игры на ПК</h2>
      <p>
        Выбирай любимые игры для ПК и крутые новинки в интернет-магазине ICE GAMES. Присылаем код мгновенно после
        оплаты, чтобы ты мог сразу окунуться в новое приключение. Нужна помощь или совет, во что поиграть? Следи за
        обзорами новинок и культовых серий в нашем
        <a href="https://icegames.store/blog" class="link" title="Перейти на страницу блога ICE GAMES" target="_blank">блоге</a>.
      </p>
      <p>
        Лицензия, в отличие от пиратского кода, открывает для тебя все возможности мультиплеера и достижений, а также
        исключает риски. Тебе не грозят блокировка аккаунта и другие санкции — играй без проблем.
      </p>
      <h3>Отличный выбор и удобный сервис</h3>
      <p>ICE GAMES — это:</p>
      <ul>
        <li>
            2500+ тайтлов, включая требовательные проекты, которые идут на крутых игровых ПК, и нетяжелые игры с простой
            графикой для старых машин или базовой сборки;
        </li>
        <li>
            лицензионные ключи для всех популярных компьютерных платформ — Steam, Epic Games, GOG, Ubisoft Connect,
            Origin, Microsoft Store и других;
        </li>
        <li>
            лучшие цены и регулярные онлайн-распродажи — мы закупаем коды дешево у разработчиков, издателей и ведущих
            поставщиков;
        </li>
        <li>все доступные способы цифровой оплаты покупки;</li>
        <li>мгновенная отправка активатора после оплаты с гарантией замены, если что-то пошло не так.</li>
      </ul>
      <p>
        Не знаешь, как активировать игру на ПК? Обратись в наш центр поддержки. Оператор поможет с любым вопросом
        профессионально и доброжелательно.
      </p>
    `;
    let breadcrumbs = [{
      name: 'Каталог',
      current: true,
    }];
  
    if (sectionName) {
      section = await Genre.findOne({alias: sectionName}).select(['name', 'description']).lean();
      sectionType = 'genres';
    
      if (!section) {
        section = await ActivationService.findOne({alias: sectionName}).select(['name', 'description']).lean();
        sectionType = 'activationServices';
      }
    
      if (!section) {
        return next();
      }
  
      breadcrumbs = [
        {
          name: 'Каталог',
          path: 'games',
        },
        {
          name: section.name,
          current: true,
        },
      ];
  
      pageDescription = section.description;
  
      switch (sectionType) {
        case 'genres': {
          metaDescription = `Каталог лучших игр в жанре ${section.name} со скидками и удобным поиском. Топ продаж от магазина лицензионных ключей ICE GAMES. Страница ${page}`;
          title = `Каталог игр ICE GAMES в жанре ${section.name} — страница ${page}`;
          hTitle = `Купить игры в жанре ${section.name} для PC`;
          genres.push(sectionName);
          break;
        }
        case 'activationServices': {
          metaDescription = `Ключи для ${section.name} в магазине ICE GAMES. Мгновенная доставка ключей активации. Широкий выбор игр, сервисная поддержка. Страница ${page}`;
          title = `Ключи для каталога игр ${section.name} со скидкой в магазине ICE GAMES — страница ${page}`;
          hTitle = `Купить ключи активации ${section.name}`;
          activationServices.push(sectionName);
          break;
        }
        default: return next();
      }
    }
  
    let allCategories = await Category.find().select(['name', 'alias']).lean();
    let allGenres = await Genre.find().select(['name', 'alias']).lean();
    let allActivationServices = await ActivationService.find().select(['name', 'alias']).lean();
    
    const minPriceProduct = await Product.findOne({active: true}).sort({priceTo: 1}).select(['priceTo']).lean();
    const maxPriceProduct = await Product.findOne({active: true}).sort({priceTo: -1}).select(['priceTo']).lean();
    const limit = 20;
    const skip = (page - 1) * limit;
  
    searchString = searchString.trim();
  
    const recIds = [];
    const recProducts = [];
    const numsSearch = searchString.match(/\d/g);
  
    const latin = getAlias(searchString, false);
    const changeLayout = getChangeLayout(searchString);
    const romaNumsSearch = toRoman(searchString, numsSearch);
  
    const shortNamesMatch = new RegExp(searchString, 'i');
    const latinShortNamesMatch = new RegExp(latin, 'i');
    const changeLayoutShortNamesMatch = new RegExp(changeLayout, 'i');
    const romaNumsShortNamesMatch = new RegExp(romaNumsSearch, 'i');
  
    const searchMatch = new RegExp(searchString, 'i');
    const latinMatch = new RegExp(latin, 'i');
    const changeLayoutMatch = new RegExp(changeLayout, 'i');
    const romaNumsSearchMatch = new RegExp(romaNumsSearch, 'i');
  
    const searchGrams = getGrams(searchString);
    const latinGrams = getGrams(latin);
    const changeLayoutGrams = getGrams(changeLayout);
    const romaNumsSearchGrams = getGrams(romaNumsSearch);
    
    const categoryFilterIds = categories.map(categoryAlias => {
      return allCategories.find(item => item.alias === categoryAlias)._id
    });
    const genreFilterIds = genres.map(genreAlias => {
      return allGenres.find(item => item.alias === genreAlias)._id
    });
    const activationServicesIds = activationServices.map(activationServiceAlias => {
      return allActivationServices.find(item => item.alias === activationServiceAlias)._id
    });
  
    const filter = {
      active: true,
    }
  
    const getWithoutSort = async (filter) => {
      let stageFilter = {
        $or: [
          {shortNames: shortNamesMatch},
          {shortNames: latinShortNamesMatch},
          {shortNames: changeLayoutShortNamesMatch},
          {shortNames: romaNumsShortNamesMatch},
        ],
      }
    
      let result = await Product.find({
        ...filter,
        ...stageFilter,
      }).skip(+skip).limit(+limit).sort({priceTo: -1, createdAt: -1}).lean();
    
      recProducts.push(...result);
    
      if (recProducts.length === +limit) {
        return recProducts;
      }
    
      const countShortNames = await Product.countDocuments({
        ...filter,
        ...stageFilter,
      });
    
      recIds.push(...result.map(item => item._id));
    
      stageFilter = {
        _id: {$nin: recIds},
        $or: [
          {name: searchMatch},
          {name: latinMatch},
          {name: changeLayoutMatch},
          {name: romaNumsSearchMatch},
        ],
      }
    
      result = await Product.find({
        ...filter,
        ...stageFilter,
      }).skip(recProducts.length ? 0 : +skip - countShortNames).limit(+limit - recProducts.length).sort({priceTo: -1, createdAt: -1}).lean();
    
      recProducts.push(...result);
    
      if (recProducts.length === +limit) {
        return recProducts;
      }
    
      const countName = await Product.countDocuments({
        ...filter,
        ...stageFilter,
      });
    
      recIds.push(...result.map(item => item._id));
    
      stageFilter = {
        _id: {$nin: recIds},
        nameGrams: {$in: searchGrams},
      }
    
      result = await Product.aggregate([
        {
          $match: {
            ...filter,
            ...stageFilter,
          }
        },
        {
          $project: {
            name: 1,
            img: 1,
            alias: 1,
            releaseDate: 1,
            priceTo: 1,
            priceFrom: 1,
            discount: 1,
            createdAt: 1,
            inStock: 1,
            SCORE: {
              $subtract: [
                {
                  $round: [{
                    $divide: [
                      {
                        $size: {
                          $filter: {
                            input: "$nameGrams",
                            cond: {
                              $in: ["$$this", searchGrams]
                            },
                          },
                        },
                      },
                      searchGrams.length,
                    ]
                  }, 2],
                },
                {
                  $round: [{
                    $divide: [
                      {
                        $size: {
                          $filter: {
                            input: "$nameGrams",
                            cond: {
                              $in: ["$$this", searchGrams]
                            },
                          },
                        },
                      },
                      {
                        $size: "$nameGrams",
                      },
                    ]
                  }, 2],
                }
              ],
            },
          },
        },
      ]).sort({SCORE: -1}).skip(recProducts.length ? 0 : +skip - countShortNames - countName).limit(+limit - recProducts.length);
    
      recProducts.push(...result);
    
      return recProducts;
    }
  
    let person = null;
    let products;
    
    allCategories = allCategories.map(category => {
      if (categories.findIndex(item => item === category.alias) > -1) {
        return {
          ...category,
          checked: true,
        }
      }
      
      return category;
    });
  
    allGenres = allGenres.map(genre => {
      if (genres.findIndex(item => item === genre.alias) > -1) {
        genre.checked = true;
      }
  
      if (section && section._id.toString() === genre._id.toString()) {
        genre.disabled = true;
      }
    
      return genre;
    });
  
    allActivationServices = allActivationServices.map(activationService => {
      if (activationServices.findIndex(item => item === activationService.alias) > -1) {
        activationService.checked = true;
      }
      
      if (section && section._id.toString() === activationService._id.toString()) {
        activationService.disabled = true;
      }
    
      return activationService;
    });
  
    if (res.locals && res.locals.person) {
      person = res.locals.person;
    }
  
    if (categoryFilterIds.length) {
      filter.categories = {$in: categoryFilterIds};
    }
  
    if (genreFilterIds.length) {
      filter.genres = {$in: genreFilterIds};
    }
  
    if (activationServicesIds.length) {
      filter.activationServiceId = {$in: activationServicesIds};
    }
  
    if (priceFrom && +priceFrom >= 0) {
      filter.priceTo = {$gte: +priceFrom};
    }
  
    if (priceTo && +priceTo >= 0) {
      filter.priceTo = {
        ...filter.priceTo,
        $lte: +priceTo,
      }
    }
  
    if (onlyStock) {
      filter.inStock = true;
    }
  
    if (searchString.length) {
      const paramsFilter = {...filter};
    
      filter['$or'] = [
        {shortNames: {$in: [searchString.toUpperCase()]}},
        {shortNames: {$in: [latin.toUpperCase()]}},
        {shortNames: {$in: [changeLayout.toUpperCase()]}},
        {shortNames: {$in: [romaNumsSearch.toUpperCase()]}},
        {name: searchMatch},
        {name: latinMatch},
        {name: changeLayoutMatch},
        {name: romaNumsSearchMatch},
        {nameGrams: {$in: searchGrams}},
        {nameGrams: {$in: latinGrams}},
        {nameGrams: {$in: changeLayoutGrams}},
        {nameGrams: {$in: romaNumsSearchGrams}},
      ];
    
      if (sort) {
        const sortObjs = {};
      
        switch (sort) {
          case 'date': {
            sortObjs.releaseDate = -1;
            break;
          }
          case 'price': {
            sortObjs.priceTo = 1;
            break;
          }
          case 'discount': {
            sortObjs.discount = -1;
            break;
          }
        }
      
        sortObjs.createdAt = -1;
      
        products = await Product.find(filter).sort(sortObjs).skip(+skip).limit(+limit).lean();
      } else {
        products = await getWithoutSort(paramsFilter);
      }
    } else {
      let sortObj = {};
    
      if (sort) {
        switch (sort) {
          case 'date': {
            sortObj.releaseDate = -1;
            break;
          }
          case 'price': {
            sortObj.priceTo = 1;
            break;
          }
          case 'discount': {
            sortObj.discount = -1;
            break;
          }
        }
      } else {
        sortObj = {priceTo: -1};
      }
    
      sortObj.createdAt = -1;
    
      products = await Product.find(filter).sort({...sortObj}).skip(+skip).limit(+limit).lean();
    }
  
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
  
    const count = await Product.countDocuments(filter);
    const isLast = +skip + +limit >= count;
    
    res.render('catalog', {
      title,
      metaDescription,
      hTitle,
      ogPath: `games${req.url}`,
      isCatalog: true,
      priceFrom: priceFrom ? priceFrom : minPriceProduct.priceTo,
      priceTo: priceTo ? priceTo : maxPriceProduct.priceTo,
      minPrice: minPriceProduct.priceTo,
      maxPrice: maxPriceProduct.priceTo,
      breadcrumbs,
      sectionName,
      sectionType,
      pageDescription,
      onlyStock,
      allCategories,
      allGenres,
      allActivationServices,
      searchString,
      sort,
      products,
      limit,
      page,
      prevPage: page > 1 && `games${section ? `/${sectionName}` : ''}?page=${+page - 1}`,
      nextPage: !isLast && `games${section ? `/${sectionName}` : ''}?page=${+page + 1}`,
      canonical: `games${section ? `/${sectionName}` : ''}`,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/')
  }
}

export const gamePage = async (req, res) => {
  try {
    const {alias} = req.params;
    const product = await Product
      .findOne({alias})
      .populate([
        'extends',
        'activationRegions',
        'genres',
        'categories',
        'platformId',
        'activationServiceId',
        'publisherId',
        'editionId',
        'dlcForId',
        {
          path: 'recommends',
          select: ['name', 'alias', 'inStock', 'img', 'priceTo', 'priceFrom'],
        },
        {
          path: 'elements',
          populate: {
            path: 'productId',
            select: ['name', 'alias', 'img'],
          }
        }
      ]);
    const person = res.locals.person;
    const reviewsFilter = {
      product: product._id,
      active: true,
    };
    const shortDescription = product.description.replace(/<[^>]+>/ig, '').replace(/\s{2,}/ig, ' ').trim().slice(0, 200);
    
    if (person) {
      reviewsFilter['$or'] = [
        {user: person._id},
        {status: 'taken'},
      ];
    } else {
      reviewsFilter.status = 'taken';
    }
    
    const reviews = await Review
      .find(reviewsFilter)
      .limit(5)
      .sort({createdAt: -1})
      .select(['eval', 'text', 'status', 'rejectionReason'])
      .populate([{
        path: 'user',
        select: ['login'],
      }])
      .lean();
    
    if (!product.active) {
      return res.status(404).render('404', {
        title: 'ICE GAMES — Страница не найдена',
        breadcrumbs: [{
          name: 'Страница не найдена',
          current: true,
        }],
      });
    }
    
    const countReviews = await Review.countDocuments({product: product._id, active: true});
    const countSales = product.inStock ? Math.floor(Math.floor(product.priceFrom) / 3 * 0.005 * (Math.floor(new Date().getHours() / 5)) * (product.top ? 1.3 : 1)) : 0;
    const comments = await Comment
      .find({subjectId: product.id, ref: 'product'})
      .populate(['author'])
      .sort({'createdAt': -1})
      .limit(3);
    const countComments = await Comment.estimatedDocumentCount();
    const genreIds = product.genres.map(genre => genre._id);
    const maxPrice = await Product.findOne({active: true}).sort({priceTo: -1}).select(['priceTo']).lean();
    const scatter = 600;
    const articles = await Article
      .find({products: {$in: [product._id.toString()]}})
      .select(['alias', 'img', 'name', 'type', 'created', 'createdAt', 'introText']);
    const recProductsFilter = { //Фильтры для подборки рекомендаций
      $and: [{_id: {$ne: product._id}}], //Отсеивает товар, на котором сейчас находимся
      inStock: true,
      active: true,
      dlc: false,
      genres: {$in: genreIds}, //Находит продукты содержащие хотя бы один из жанров текущего товара
      /*$or: [ //"ИЛИ" для связок
        {bundleId: {$ne: null}, isOriginalInBundle: true}, //Если товар состоит в связке, то он должен быть исходным
        {bundleId: null}, //Иначе он не должен состоять в связке вовсе
      ],*/
    };
    const sampleParams = {
      name: product.name,
      activationService: product.activationServiceId.name,
      genres: product.genres.map(item => item.name).join(', '),
      price: product.priceTo,
      discount: product.discount,
    };
    const sampleParamNames = Object.keys(sampleParams);
    let h1 = product.sampleH1 || `Ключ для ${product.name}`;
    let title = product.sampleTitle || `Купить лицензионный ключ ${product.name} по цене ${product.priceTo}₽ для ${product.activationServiceId.name} в магазине ICE GAMES`;
    let metaDescription = product.sampleMetaDescription || `Лицензионный ключ для ${product.name} (${product.genres.map(item => item.name).join(', ')}) дешево для активации в ${product.activationServiceId.name} в магазине ICE GAMES${product.discount > 0 ? ` со скидкой ${product.discount}%` : ''}. Мгновенная доставка ключа на почту. Оплата удобным способом.`;
    let isProductNoReview = true;
    let isProductNotPurchased = true;
    let lastViewedProducts = [];
    let currentProductInCart = false;
    let currentProductInFavorite = false;
    let bundleProducts = null;
    let seriesProducts = null;
    let subscribed = false;
    let favoritesProducts;
    let cart;
    let typeTrailerCover;
    let additions = await Product
      .find({dlc: true, dlcForId: product._id})
      .select(['name', 'img', 'priceTo', 'priceFrom', 'dlc', 'inStock', 'alias', 'preOrder'])
      .lean();
  
    sampleParamNames.forEach(item => {
      const regExp = new RegExp(`{${item}}`, 'g');
      
      if (product.sampleH1) {
        h1 = h1.replace(regExp, sampleParams[item]);
      }
      
      if (product.sampleTitle) {
        title = title.replace(regExp, sampleParams[item]);
      }
  
      if (product.sampleMetaDescription) {
        metaDescription = metaDescription.replace(regExp, sampleParams[item]);
      }
    });
  
    if (person) {
      const email = person.email;
      const productId = product._id.toString();
      
      cart = person.cart;
      favoritesProducts = person.favoritesProducts;
  
      if (favoritesProducts && favoritesProducts.includes(productId)) {
        currentProductInFavorite = true;
      }
      
      if (cart && cart.includes(productId)) {
        currentProductInCart = true;
      }
      
      if (product.subscribesInStock.includes(email)) {
        subscribed = true;
      }
    }
  
    if (req.session.isAuth) {
      const favoritesProducts = person.favoritesProducts;
      const cart = person.cart;
      const order = await Order.findOne({status: 'paid', userId: res.locals.person._id, items: {$elemMatch: {productId: product._id}}});
  
      if (order) {
        isProductNotPurchased = false;
      }
  
      const viewedProductsResult = await User
        .findById(person._id)
        .select('viewedProducts')
        .slice('viewedProducts', 7)
        .populate('viewedProducts', ['alias', 'name', 'img', 'priceTo', 'priceFrom', 'dsId', 'dlc', 'inStock', 'preOrder'])
        .lean();
  
      lastViewedProducts = viewedProductsResult.viewedProducts;
  
      lastViewedProducts = lastViewedProducts && lastViewedProducts.map(viewedProduct => {
        const productId = viewedProduct._id.toString();
        
        if (favoritesProducts && favoritesProducts.includes(productId)) {
          viewedProduct.inFavorites = true;
        }
    
        if (cart && cart.includes(productId)) {
          viewedProduct.inCart = true;
        }
        
        if (productId === product._id.toString()) {
          viewedProduct.currentPorductPage = true;
        }
    
        return viewedProduct;
      });
      
      isProductNoReview = await Review.find({product: product._id, user: res.locals.person._id});
      isProductNoReview = !isProductNoReview.length;
      
      let viewedProducts = person.viewedProducts;
      const viewedProductIndex = viewedProducts.findIndex(viewedProductId => {
        return viewedProductId.toString() === product._id.toString();
      });
      
      if (viewedProductIndex !== -1) {
        viewedProducts.splice(viewedProductIndex, 1);
      }
  
      viewedProducts.unshift(product._id);
      
      person.viewedProducts = viewedProducts;
      await person.save();
    }
    
    let trailerId = null;
  
    if (product.trailerLink) {
      trailerId = product.trailerLink.split('v=')[1];
    }
    
    if (product.bundleId) {
      recProductsFilter.bundleId = {$ne: product.bundleId}; //Отсеиваем товары, которые выводятся в блоке связок
      bundleProducts = await Product
        .find({bundleId: product.bundleId})
        .sort({'priceFrom': 1})
        .select(['name', 'alias', 'elements', 'editionId'])
        .populate('editionId', ['name'])
        .lean();
  
      bundleProducts = bundleProducts.map(bundleProduct => {
        if (bundleProduct._id.toString() === product._id) {
          bundleProduct.isCurrent = true;
        }

        bundleProduct.moreElements = bundleProduct.elements.length - 5;
        bundleProduct.elements = bundleProduct.elements.slice(0, 5);
        
        return bundleProduct;
      });
    }
    
    if (product.seriesId) {
      recProductsFilter.seriesId = {$ne: product.seriesId}; //Отсеиваем товары, которые есть в серии текущей игры
      seriesProducts = await Product
        .find({_id: {$ne: product._id}, seriesId: product.seriesId, active: true})
        .select(['name', 'alias', 'priceTo', 'priceFrom', 'img', 'inStock', 'preOrder'])
        .lean();
    } else if (product.bundleId) {
      const originalProduct = await Product.findOne({bundleId: product.bundleId, isOriginalInBundle: true});
      
      if (originalProduct && originalProduct.seriesId) {
        recProductsFilter.seriesId = {$ne: originalProduct.seriesId, active: true}; //Отсеиваем товары, которые есть в серии исходной игры связки, если текущая не принадлежит серии
        seriesProducts = await Product
          .find({_id: {$ne: originalProduct.id}, seriesId: originalProduct.seriesId, active: true})
          .select(['name', 'alias', 'priceTo', 'priceFrom', 'img', 'inStock'])
          .lean();
      }
    }
    
    const recommendIds = [];
    
    let recProducts = product.recommends.map(item => {
      recommendIds.push(item._id);
      
      return {...item.toObject()};
    });
    
    recProductsFilter.$and.push({_id: {$nin: recommendIds}});
    
    if (recProducts.length < 8) {
      const dopRect = await Product
        .find({
          ...recProductsFilter,
          priceTo: {
            $gte: product.priceTo,
          },
        })
        .select(['name', 'alias', 'inStock', 'img', 'priceTo', 'priceFrom', 'preOrder'])
        .limit(8 - recProducts.length)
        .lean();
      
      recProducts = [...recProducts, ...dopRect];
    }
  
    if (recProducts.length < 8) {
      const dopRect = await Product
        .find({
          ...recProductsFilter,
          priceTo: {
            $lt: product.priceTo,
          },
        })
        .select(['name', 'alias', 'inStock', 'img', 'priceTo', 'priceFrom'])
        .limit(8 - recProducts.length)
        .lean();
    
      recProducts = [...recProducts, ...dopRect];
    }
  
    recProducts = recProducts.map(item => {
      const productId = item._id.toString();
  
      if (favoritesProducts && favoritesProducts.includes(productId)) {
        item.inFavorites = true;
      }
  
      if (cart && cart.includes(productId)) {
        item.inCart = true;
      }
  
      return item;
    })
  
    additions = additions.map(item => {
      const productId = item._id.toString();
  
      if (favoritesProducts && favoritesProducts.includes(productId)) {
        item.inFavorites = true;
      }
  
      if (cart && cart.includes(productId)) {
        item.inCart = true;
      }
  
      return item;
    })
  
    seriesProducts = seriesProducts && seriesProducts.map(item => {
      const productId = item._id.toString();
  
      if (favoritesProducts && favoritesProducts.includes(productId)) {
        item.inFavorites = true;
      }
  
      if (cart && cart.includes(productId)) {
        item.inCart = true;
      }
  
      return item;
    })
  
    const seriesIsSlider = seriesProducts && seriesProducts.length > 5;
    
    if (trailerId) {
      const responseTrailerCover = await fetch(`https://img.youtube.com/vi/${trailerId}/maxresdefault.jpg`);
      const statusTrailerCover = responseTrailerCover.status;
      
      typeTrailerCover = statusTrailerCover === 404 ? 'mqdefault' : 'maxresdefault';
    }
    
    res.render('game', {
      h1,
      title,
      metaDescription,
      ogPath: `games/${product.alias}`,
      typeTrailerCover,
      product,
      totalGradeParse: Number.isInteger(+product.totalGradeParse) ? `${product.totalGradeParse}.0` : product.totalGradeParse,
      stepRating: product.totalGradeParse && product.totalGradeParse >= 7 ? 'top' : product.totalGradeParse >= 4 ? 'middle' : 'bottom',
      trailerId,
      isProductNotPurchased,
      isProductNoReview,
      comments,
      countComments,
      lastViewedProducts,
      currentProductInCart,
      currentProductInFavorite,
      bundleProducts,
      seriesProducts,
      recProducts,
      seriesIsSlider,
      subscribed,
      countSales,
      reviews,
      countReviews,
      articles,
      additions,
      shortDescription,
      ogImage: product.img,
      breadcrumbs: [
        {
          name: 'Каталог',
          path: 'games',
        },
        {
          name: product.name,
          current: true,
        },
      ],
    });
  } catch (e) {
    console.log(e);
    res.redirect('/games');
  }
}
import Product from "../../models/Product.js";
import Usp from "../../models/Usp.js";
import Category from "../../models/Category.js";
import Genre from "../../models/Genre.js";
import Article from "../../models/Article.js";
import User from "../../models/User.js";
import Partner from "../../models/Partner.js";
import {achievementEvent} from "../../services/achievement.js";

export const homepage = async (req, res) => {
  const sliderProducts = await Product
    .find({inHomeSlider: true, inStock: true})
    .limit(5)
    .select(['name', 'alias', 'description', 'priceTo', 'priceFrom', 'img', 'coverImg', 'coverVideo', 'discount'])
    .lean();
  const usp = await Usp.find().select('text').lean();
  const categories = await Category.find().select('name').lean();
  const genres = await Genre.find().select(['name', 'img', 'bgColor']).lean();
  const partners = await Partner.find().select(['name', 'img', 'link']).lean();
  const articles = await Article
    .find({active: true})
    .select(['name', 'alias', 'introText', 'type', 'createdAt', 'img'])
    .limit(9)
    .lean();
  const inviter = req.query.inviter;
  const checkEmailHash = req.query.confirmEmail;
  const catalog = [];
  let checkedEmail = false;
  
  if (checkEmailHash) {
    const user = await User.findOne({checkEmailHash});
    
    if (user) {
      if (user.inviter) {
        const inviter = await User.findById(user.inviter);
    
        if (inviter) {
          await inviter.increaseRating(5);
          await achievementEvent('friendInvitation', inviter);
        }
  
        user.inviter = undefined;
      }
  
      user.checkEmailHash = undefined;
      user.emailChecked = true;
  
      await user.save();
  
      checkedEmail = true;
    }
  }
  
  const noveltiesProduct = await Product
    .find({preOrder: false, active: true})
    .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dlc', 'dsId', 'inStock'])
    .sort({'releaseDate': -1})
    .limit(10)
    .lean();
  
  const preOrders = await Product
    .find({preOrder: true, active: true})
    .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dlc', 'dsId', 'inStock'])
    .limit(10)
    .lean();
  
  const discounts = await Product
    .find({discount: {$gt: 60}, active: true})
    .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dlc', 'dsId', 'inStock'])
    .sort({'priceFrom': -1})
    .limit(10)
    .lean();
  
  catalog.push({
    category: {name: 'Новинки'},
    products: noveltiesProduct,
  })
  
  catalog.push({
    category: {name: 'Скидки'},
    products: discounts,
  })
  
  catalog.push({
    category: {name: 'Предзаказы'},
    products: preOrders,
  })
  
  for (let category of categories) {
    const products = await Product
      .find({categories: {$in: category._id.toString()}, active: true})
      .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dlc', 'dsId', 'inStock'])
      .limit(10)
      .lean();
  
    catalog.push({
      category,
      products,
    });
  }
  
  if (inviter && !req.session.isAuth) {
    res.cookie('inviterId', inviter).redirect('/');
  }
  
  res.render('home', {
    title: "ICE Games — магазин ключей",
    metaDescription: 'Добро пожаловать в интернет-магазин ключей игр - ICE Games',
    isHome: true,
    sliderProducts,
    usp,
    catalog,
    genres,
    articles,
    checkedEmail,
    partners,
  });
}
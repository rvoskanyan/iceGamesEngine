import Product from "../../models/Product.js";
import Usp from "../../models/Usp.js";
import Category from "../../models/Category.js";
import Genre from "../../models/Genre.js";
import Article from "../../models/Article.js";

export const homepage = async (req, res) => {
  const sliderProducts = await Product
    .find({inHomeSlider: true})
    .limit(5)
    .select(['name', 'alias', 'description', 'priceTo', 'priceFrom', 'img', 'coverImg', 'coverVideo', 'discount'])
    .lean();
  const usp = await Usp.find().select('text').lean();
  const categories = await Category.find().select('name').lean();
  const genres = await Genre.find().select(['id', 'name', 'img', 'url']).lean();
  const articles = await Article.find({active: true}).select(['name', 'alias', 'introText', 'type', 'createdAt', 'img']).lean();
  const inviter = req.query.inviter;
  const catalog = [];
  
  for (let category of categories) {
    const products = await Product
      .find({categories: {$in: category._id.toString()}})
      .select(['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dlc', 'dsId'])
      .lean()
      .limit(10);
  
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
  });
}
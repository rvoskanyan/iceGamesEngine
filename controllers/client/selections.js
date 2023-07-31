import Selection from "../../models/Selection.js";
import Article from "../../models/Article.js";

export const selectionsPage = async (req, res) => {
  try {
    const countSelections = await Selection.countDocuments({ourChoice: false});
    const selections = await Selection.find({ourChoice: false}).sort({createdAt: -1}).limit(4).lean();
    const ourChoice = await Selection.findOne({ourChoice: true}).select(['products']).populate([{
      path: 'products',
      select: ['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dlc', 'inStock'],
    }]).lean();
  
    res.render('selections', {
      title: 'Подборки — ICE GAMES',
      metaDescription: 'Подборки игр от магазина ключей компьютерных игр ICE GAMES.',
      breadcrumbs: [{
        name: 'Подборки',
        current: true,
      }],
      ourChoice: ourChoice.products,
      countSelections,
      selections,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

export const selectionPage = async (req, res) => {
  try {
    const countSelections = await Selection.countDocuments({alias: {$ne: req.params.alias}});
    const selections = await Selection.find({alias: {$ne: req.params.alias}}).sort({createdAt: -1}).limit(4).lean();
    const selection = await Selection.findOne({alias: req.params.alias}).populate([{
      path: 'products',
      select: ['name', 'alias', 'img', 'priceTo', 'priceFrom', 'dlc', 'inStock'],
    }]).lean();
    const articles = await Article
      .find({products: {$in: selection.products}})
      .select(['alias', 'img', 'name', 'type', 'created', 'createdAt', 'introText'])
      .limit(3);
    
    res.render('selection', {
      title: `ICE GAMES — Подборка ${selection.name}`,
      metaDescription: `Подборка игр ${selection.name} от магазина ключей компьютерных игр ICE GAMES.`,
      breadcrumbs: [
        {
          name: 'Подборки',
          path: 'selections',
        },
        {
          name: selection.name,
          current: true,
        },
      ],
      countSelections,
      selections,
      selection,
      articles,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/selections');
  }
}
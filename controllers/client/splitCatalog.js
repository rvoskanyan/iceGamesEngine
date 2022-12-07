import Genre from "../../models/Genre.js";
import Product from "../../models/Product.js";
import ActivationService from "../../models/ActivationService.js";

export const pageSplitCatalog = async (req, res, next) => {
  try {
    const alias = req.params.alias;
    let section = await Genre.findOne({alias}).select(['name', 'description']).lean();
    
    if (!section) {
      section = await ActivationService.findOne({alias}).select(['name', 'description']).lean();
    }
    
    if (!section) {
      return next();
    }
    
    res.redirect(`/games/${alias}`);
  } catch (e) {
    console.log(e);
    res.redirect('/games');
  }
}
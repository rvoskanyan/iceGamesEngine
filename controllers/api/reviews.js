import Product from "../../models/Product.js";

export const getReviews = async (req, res) => {
  try {
    res.json({
      reviews: [],
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
    });
  }
}
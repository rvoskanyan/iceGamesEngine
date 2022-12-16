import Review from "../../models/Review.js";

export const getReviews = async (req, res) => {
  try {
    const {limit = 5, skip = 0, productId = null} = req.query;
    const filter = {active: true, status: 'taken'};
  
    productId && (filter.product = productId);
  
    const countReviews = await Review.countDocuments(filter);
    const reviews = await Review
      .find(filter)
      .skip(skip)
      .limit(limit)
      .select(['text', 'eval'])
      .populate([
        {
          path: 'product',
          select: ['name', 'alias'],
        },
        {
          path: 'user',
          select: ['login'],
        },
      ])
      .sort({createdAt: -1})
      .lean();
    
    res.json({
      success: true,
      isLast: +skip + +limit >= countReviews,
      reviews,
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
    });
  }
}
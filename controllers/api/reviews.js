import Review from "../../models/Review.js";

export const getReviews = async (req, res) => {
  try {
    const {limit = 5, skip = 0} = req.query;
    
    const reviews = await Review
      .find({active: true})
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
      reviews,
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
    });
  }
}
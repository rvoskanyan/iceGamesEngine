import Review from "../../models/Review.js";

export const getReviews = async (req, res) => {
  try {
    const {
      limit = 6,
      skip = 0,
      target = '',
      targetId = null,
      id = null
    } = req.query;
    
    if (!target.length) {
      throw new Error('Target is require param');
    }
    
    const filter = {active: true, status: 'taken', target};
  
    targetId && (filter.targetId = targetId);
    id && (filter._id = id)
  
    const countReviews = await Review.countDocuments(filter);
    const reviews = await Review
      .find(filter)
      .skip(skip)
      .limit(limit)
      .select(['text', 'eval', 'target', 'targetId'])
      .populate([
        {
          path:'targetId',
          populate: [
            {
              path: 'activationServiceId',
              select: ['name']
            },
            {
              path: 'activationRegions',
              select: ['name']
            }
          ]
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
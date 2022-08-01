import Product from "../../models/Product.js";

export const getReviews = async (req, res) => {
  try {
    const {limit = 5, skip = 0} = req.query;
    const products = await Product.aggregate([
      {$unwind: '$reviews'},
      {$skip: parseInt(skip)},
      {$limit: parseInt(limit)},
      {$sort: {createdAt: -1}},
      {
        $lookup: {
          from: 'users',
          localField: 'reviews.userId',
          foreignField: '_id',
          as: 'reviews.user',
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          alias: 1,
          'reviews.eval': 1,
          'reviews.text': 1,
          'reviews.user.login': 1,
        },
      },
      {$unwind: '$reviews.user'},
    ]);
    
    res.json({
      products,
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
    });
  }
}
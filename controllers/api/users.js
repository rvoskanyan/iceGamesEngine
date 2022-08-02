import User from "../../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const {limit = 20, skip = 0} = req.query;
    const countUsers = await User.estimatedDocumentCount({locked: false, active: true});
    const users = await User
      .find({locked: false, active: true})
      .sort({rating: -1, createdAt: 1})
      .select(['login', 'rating'])
      .limit(limit)
      .skip(skip)
      .lean();
    
    res.json({
      success: true,
      isLast: +skip + +limit >= countUsers,
      countUsers,
      users,
    });
  } catch (e) {
    console.log(e);
    res.json({error: true});
  }
}
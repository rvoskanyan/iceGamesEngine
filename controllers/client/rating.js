import User from "../../models/User.js";

export const ratingPage = async (req, res) => {
  try {
    const users = await User.find().sort({rating: -1, createdAt: 1}).limit(15);
    const countUsers = await User.estimatedDocumentCount();
    
    res.render('rating', {
      title: 'ICE Games -- рейтинг пользователей',
      isRating: true,
      users,
      countUsers,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
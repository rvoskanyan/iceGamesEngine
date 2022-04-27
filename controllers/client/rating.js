import User from "../../models/User.js";

export const ratingPage = async (req, res) => {
  try {
    const users = await User.find().sort({rating: -1, createdAt: 1}).limit(15);
    const countUsers = await User.estimatedDocumentCount();
    
    res.render('rating', {
      title: 'ICE Games — рейтинг пользователей',
      metaDescription: 'Страница со всеми пользователями нашего интернет-магазина и их позицией в рейтинге',
      isRating: true,
      users,
      countUsers,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}

export const profileViewPage = async (req, res) => {
  try {
    const {login} = req.params;
    const user = await User.findOne({login}).select(['rating', 'invitedUsers', 'viewedArticles', 'createdAt']);
    const countUsers = await User.estimatedDocumentCount();
    
    user.login = login;
    
    res.render('profileViewPage', {
      title: `ICE Games — Профиль пользователя ${login}`,
      metaDescription: `Просмотр профиля пользователя ${login} на ICE Games`,
      user,
      countUsers,
    })
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
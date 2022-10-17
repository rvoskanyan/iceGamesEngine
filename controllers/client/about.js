export const aboutPage = async (req, res) => {
  try {
    res.render('about', {
      title: 'О магазине ICE GAMES',
      metaDescription: 'Все подробности о магазине компьютерных игр ICE GAMES. Наша главная миссия — создать неразрывное активное комьюнити геймеров! Заходите, расскажем об истории компании, команде и целях.',
      ogPath: 'about',
      isAbout: true,
      breadcrumbs: [{
        name: 'О компании',
        current: true,
      }],
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
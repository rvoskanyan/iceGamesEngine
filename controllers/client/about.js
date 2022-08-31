export const aboutPage = async (req, res) => {
  try {
    res.render('about', {
      title: 'ICE GAMES — О компании',
      metaDescription: 'Все подробности о магазине компьютерных игр ICE GAMES! Наша история, команда и цели!',
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
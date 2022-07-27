export const aboutPage = async (req, res) => {
  try {
    res.render('about', {
      title: 'ICE GAMES — О Магазине',
      metaDescription: 'Все подробности о магазине компьютерных игр ICE GAMES! Наша история, команда и цели!',
      isAbout: true,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
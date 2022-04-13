export const aboutPage = async (req, res) => {
  try {
    res.render('about', {
      title: 'ICE Games -- О Магазине',
      isAbout: true,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
export const aboutPage = async (req, res) => {
  try {
    res.render('about', {
      title: 'ICE Games — О Магазине',
      metaDescription: 'Знакомство с нами и нашим магазином',
      isAbout: true,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
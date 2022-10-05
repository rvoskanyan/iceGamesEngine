export const logout = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
}

export const getCourse = async (req, res) => {
  if (!req.session.isAuth) {
    return res.status(404).render('404', {
      title: 'ICE GAMES — Страница не найдена',
      breadcrumbs: [{
        name: 'Страница не найдена',
        current: true,
      }],
    });
  }
  
  res.render('course');
}
export const checkPlatform = (req, res, next) => {
  const platform = req.params.platform || 'pc';
  const platforms = ['xbox'];

  if (platform === 'pc') {
    return res.redirect('/');
  }

  if (!platforms.includes(platform)) {
    return res.status(404).render('404', {
      title: 'ICE Games — Страница не найдена',
      breadcrumbs: [{
        name: 'Страница не найдена',
        current: true,
      }],
    });
  }

  req.platform = platform;

  if (req.platform !== 'pc') {
    res.locals = {
      ...res.locals,
      platform,
    }
  }

  next();
}

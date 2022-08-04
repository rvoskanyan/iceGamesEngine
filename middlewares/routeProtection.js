export const admin = (req, res, next) => {
  if (!res.locals.person || res.locals.person.role !== 'admin' || res.locals.person.role !== 'moderator') {
    return res.render('404', {
      title: 'ICE Games — Страница не найдена'
    });
  }
  
  next();
}
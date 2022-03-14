module.exports = (req, res, next) => {
  res.locals = {
    ...res.locals,
    isAuth: req.session.isAuth,
    websiteAddress: 'http://141.8.194.196:4000/',
  }
  
  next();
}
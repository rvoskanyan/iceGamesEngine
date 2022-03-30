const {websiteAddress} = require('../config');

module.exports = (req, res, next) => {
  res.locals = {
    ...res.locals,
    websiteAddress,
    isAuth: req.session.isAuth,
  }
  
  next();
}
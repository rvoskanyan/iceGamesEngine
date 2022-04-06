const {websiteAddress} = require('../config');
const User = require('../models/User');
const Guest = require('../models/Guest');

module.exports = async (req, res, next) => {
  let person = null;
  
  if (req.session.isAuth) {
    person = await User.findById(req.session.userId);
  } else {
    const guestId = req.cookies.guestId;
    
    if (guestId) {
      person = await Guest.findById(guestId);
    }
  }
  
  res.locals = {
    ...res.locals,
    websiteAddress,
    isAuth: req.session.isAuth,
    person,
  }
  
  next();
}
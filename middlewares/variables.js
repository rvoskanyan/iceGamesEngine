import { websiteAddress } from './../config.js';
import User from './../models/User.js';
import Guest from './../models/Guest.js';

export default async (req, res, next) => {
  const currentYear = new Date().getFullYear();
  let person = null;
  let agreementAccepted = false;
  
  if (req.session.isAuth) {
    person = await User.findById(req.session.userId);
  } else {
    const guestId = req.cookies.guestId;
    
    if (guestId) {
      person = await Guest.findById(guestId);
    }
  }
  
  if (req.cookies.agreementAccepted) {
    agreementAccepted = true;
  }
  
  res.locals = {
    ...res.locals,
    websiteAddress,
    isAuth: req.session.isAuth,
    person,
    agreementAccepted,
    currentYear,
  }
  
  next();
}
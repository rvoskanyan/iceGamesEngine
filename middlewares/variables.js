import {websiteAddress} from './../config.js';
import User from './../models/User.js';
import Guest from './../models/Guest.js';
import platform from "../models/Platform.js";

export default async (req, res, next) => {
  const currentYear = new Date().getFullYear();
  let person = null;
  let agreementAccepted = false;
  let platform = '';
  
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
  
  if (req.cookies.platform && req.cookies.platform !== 'pc') {
    platform = req.cookies.platform;
  }
  
  res.locals = {
    ...res.locals,
    websiteAddress,
    isAuth: req.session.isAuth,
    person,
    agreementAccepted,
    currentYear,
    platform,
  }
  
  next();
}
import {Router} from "express";
import fetch from "node-fetch";
import User from "../../models/User.js";
import {achievementEvent} from "../../services/achievement.js";

const router = Router();

router.get('/', async (req, res) => {
  const websiteAddress = process.env.WEB_SITE_ADDRESS;
  
  try {
    const token = req.query.access_token;
    const error = req.query.error;
  
    if (req.session.isAuth) {
      throw new Error('Already signed in');
    }
  
    if (!token && !error) {
      return res.send(`
      <script>
        window.addEventListener('load', () => {
          if (window.location.hash.includes("#")) {
            return window.location.replace(window.location.href.replace('#', '?'));
          }
          
          window.location.replace('${websiteAddress}');
        });
      </script>
    `);
    }
  
    if (error) {
      return res.redirect(websiteAddress);
    }
  
    const responseInfo = await fetch('https://login.yandex.ru/info', {headers: {'Authorization': `OAuth ${token}`}});
    const data = await responseInfo.json();
    const yaId = +data.id;
    const user = await User.findOne({yaId});
    
    if (user) {
      req.session.isAuth = true;
      req.session.userId = user._id.toString();
      
      return res.redirect(`${websiteAddress}profile`);
    }
    
    const login = data.login[0].toUpperCase() + data.login.slice(1).toLowerCase();
    const email = data.default_email.toLowerCase();
    const existingUser = await User.findOne({$or: [{login}, {email}]});
    const inviterId = req.cookies;
    
    if (existingUser) {
      throw new Error('Email or login already taken');
    }
  
    const newUser = new User({
      login,
      email,
      yaId,
      emailChecked: true,
    });
  
    await newUser.save();
  
    if (inviterId) {
      const inviter = await User.findById(inviterId);
  
      res.clearCookie('inviterId');
    
      if (inviter) {
        inviter.invitedUsers.push(newUser._id);
        await inviter.save();
        await inviter.increaseRating(5);
        await achievementEvent('friendInvitation', inviter);
      }
    }
  
    res.redirect(`${websiteAddress}profile`);
  } catch (e) {
    console.log(e);
    res.redirect(websiteAddress);
  }
});

export default router;
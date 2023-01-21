import {Router} from "express";
import fetch from "node-fetch";

const router = Router();

router.get('/', async (req, res) => {
  const websiteAddress = process.env.WEB_SITE_ADDRESS;
  const token = req.query.access_token;
  
  if (!token) {
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
  
  const responseInfo = await fetch('https://login.yandex.ru/info', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `${token}`,
    },
  });
  
  console.log(responseInfo);
  
  const resultInfo = await responseInfo.json();
  
  console.log(resultInfo);
  
  res.send(`<h2>${token}</h2>`);
});

export default router;
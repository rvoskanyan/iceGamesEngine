import {Router} from 'express';
import {
  gamesPage,
  gamePage,
} from "../../controllers/client/games.js";

const router = Router();

router.get('/sitemap.xml', (req, res) => {
  res.set('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>https://netpeak.net/bg/bg/sitemap.xml/</loc>
    </sitemap>
    <sitemap>
        <loc>https://netpeak.net/bg/blog/sitemap.xml/</loc>
    </sitemap>
    <sitemap>
        <loc>https://netpeak.net/blog/sitemap.xml/</loc>
    </sitemap>
    <sitemap>
        <loc>https://netpeak.net/de/blog/sitemap.xml/</loc>
    </sitemap>
    <sitemap>
        <loc>https://netpeak.net/en/gb/sitemap.xml/</loc>
    </sitemap>
    <sitemap>
        <loc>https://netpeak.net/en/us/sitemap.xml/</loc>
    </sitemap>
    <sitemap>
        <loc>https://netpeak.net/pl/blog/sitemap.xml/</loc>
    </sitemap>
    <sitemap>
        <loc>https://netpeak.net/ru/blog/sitemap.xml/</loc>
    </sitemap>
    <sitemap>
        <loc>https://netpeak.net/ru/kz/sitemap.xml/</loc>
    </sitemap>
    <sitemap>
        <loc>https://netpeak.net/ru/ua/sitemap.xml/</loc>
    </sitemap>
    <sitemap>
        <loc>https://netpeak.net/uk/blog/sitemap.xml/</loc>
    </sitemap>
    <sitemap>
        <loc>https://netpeak.net/uk/ua/sitemap.xml/</loc>
    </sitemap>
</sitemapindex>`)
});

router.get('/', gamesPage);
router.get('/:alias', gamePage);

export default router;
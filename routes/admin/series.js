const {Router} = require('express');
const {
  pageSeries,
  pageAddSeries,
  addSeries,
  pageEditSeries,
  editSeries,
  pageAddGameSeries,
  addGameSeries,
} = require("../../controllers/admin/series");

const router = Router();

router.get('/', pageSeries);

router.get('/add', pageAddSeries);
router.post('/add', addSeries);

router.get('/edit/:seriesId', pageEditSeries);
router.post('/edit/:seriesId', editSeries);

router.get('/:seriesId/addGame', pageAddGameSeries);
router.post('/:seriesId/addGame', addGameSeries);

module.exports = router;
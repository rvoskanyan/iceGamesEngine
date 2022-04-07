import {Router} from 'express';
import {
  pageSeries,
  pageAddSeries,
  addSeries,
  pageEditSeries,
  editSeries,
  pageAddGameSeries,
  addGameSeries,
} from "./../../controllers/admin/series.js";

const router = Router();

router.get('/', pageSeries);

router.get('/add', pageAddSeries);
router.post('/add', addSeries);

router.get('/edit/:seriesId', pageEditSeries);
router.post('/edit/:seriesId', editSeries);

router.get('/:seriesId/addGame', pageAddGameSeries);
router.post('/:seriesId/addGame', addGameSeries);

export default router;
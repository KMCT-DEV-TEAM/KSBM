import express from 'express';
import { getHeaderSettings, updateHeaderSettings, getHeroSettings, updateHeroSettings } from './cms.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/header')
  .get(getHeaderSettings)
  .put(protect, updateHeaderSettings);

router.route('/hero')
  .get(getHeroSettings)
  .put(protect, updateHeroSettings);

export default router;

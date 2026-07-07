import express from 'express';
import { getHeaderSettings, updateHeaderSettings, getAboutSettings, updateAboutSettings } from './cms.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/header')
  .get(getHeaderSettings)
  .put(protect, updateHeaderSettings);

router.route('/about')
  .get(getAboutSettings)
  .put(protect, updateAboutSettings);

export default router;

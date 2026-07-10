import express from 'express';
import {
  getHeaderSettings,
  updateHeaderSettings,
  getAboutSettings,
  updateAboutSettings,
  getHeroSettings,
  updateHeroSettings,
  getProgramsSettings,
  updateProgramsSettings
} from './cms.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/header')
  .get(getHeaderSettings)
  .put(protect, updateHeaderSettings);

router.route('/about')
  .get(getAboutSettings)
  .put(protect, updateAboutSettings);

router.route('/hero')
  .get(getHeroSettings)
  .put(protect, updateHeroSettings);

router.route('/programs')
  .get(getProgramsSettings)
  .put(protect, updateProgramsSettings);

export default router;

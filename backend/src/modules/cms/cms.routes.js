import express from 'express';
import {
  getHeaderSettings,
  updateHeaderSettings,
  getAboutSettings,
  updateAboutSettings,
  getHeroSettings,
  updateHeroSettings,
  getProgramsSettings,
  updateProgramsSettings,
  getAccreditationSettings,
  updateAccreditationSettings,
  getFacilitiesSettings,
  updateFacilitiesSettings
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

router.route('/accreditation')
  .get(getAccreditationSettings)
  .put(protect, updateAccreditationSettings);

router.route('/facilities')
  .get(getFacilitiesSettings)
  .put(protect, updateFacilitiesSettings);

export default router;

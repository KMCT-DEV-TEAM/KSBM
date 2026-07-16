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
  updateFacilitiesSettings,
  getManagementSettings,
  updateManagementSettings,
  getPlacementSettings,
  updatePlacementSettings,
  getTestimonialsSettings,
  updateTestimonialsSettings,
  getAchievementsSettings,
  updateAchievementsSettings,
  getRecruitersSettings,
  updateRecruitersSettings,
  getLifeAtKsbmSettings,
  updateLifeAtKsbmSettings,
  getNewsSettings,
  updateNewsSettings,
  getFooterSettings,
  updateFooterSettings,
  getAboutUsHeroSettings,
  updateAboutUsHeroSettings,
  getVisionMissionSettings,
  updateVisionMissionSettings,
  getLeadershipSettings,
  updateLeadershipSettings,
  getLegacySettings,
  updateLegacySettings,
  getAboutUsStatsSettings,
  updateAboutUsStatsSettings,
  getAdvisoryBoardSettings,
  updateAdvisoryBoardSettings,
  getGoverningBodySettings,
  updateGoverningBodySettings,
  getAboutCtaSettings,
  updateAboutCtaSettings,
  getFacilitiesPageSettings,
  updateFacilitiesPageSettings,
  getFacultySettings,
  updateFacultySettings
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

router.route('/management')
  .get(getManagementSettings)
  .put(protect, updateManagementSettings);

router.route('/placement')
  .get(getPlacementSettings)
  .put(protect, updatePlacementSettings);

router.route('/testimonials')
  .get(getTestimonialsSettings)
  .put(protect, updateTestimonialsSettings);

router.route('/achievements')
  .get(getAchievementsSettings)
  .put(protect, updateAchievementsSettings);

router.route('/recruiters')
  .get(getRecruitersSettings)
  .put(protect, updateRecruitersSettings);

router.route('/life-at-ksbm')
  .get(getLifeAtKsbmSettings)
  .put(protect, updateLifeAtKsbmSettings);

router.route('/news')
  .get(getNewsSettings)
  .put(protect, updateNewsSettings);

router.route('/footer')
  .get(getFooterSettings)
  .put(protect, updateFooterSettings);

router.route('/about-us-hero')
  .get(getAboutUsHeroSettings)
  .put(protect, updateAboutUsHeroSettings);

router.route('/vision-mission')
  .get(getVisionMissionSettings)
  .put(protect, updateVisionMissionSettings);

router.route('/leadership')
  .get(getLeadershipSettings)
  .put(protect, updateLeadershipSettings);

router.route('/legacy')
  .get(getLegacySettings)
  .put(protect, updateLegacySettings);

router.route('/about-us-stats')
  .get(getAboutUsStatsSettings)
  .put(protect, updateAboutUsStatsSettings);

router.route('/advisory-board')
  .get(getAdvisoryBoardSettings)
  .put(protect, updateAdvisoryBoardSettings);

router.route('/governing-body')
  .get(getGoverningBodySettings)
  .put(protect, updateGoverningBodySettings);

router.route('/about-us-cta')
  .get(getAboutCtaSettings)
  .put(protect, updateAboutCtaSettings);

router.route('/facilities-page')
  .get(getFacilitiesPageSettings)
  .put(protect, updateFacilitiesPageSettings);

router.route('/faculty')
  .get(getFacultySettings)
  .put(protect, updateFacultySettings);

export default router;

import express from 'express';
import { submitGrievance, getGrievances, updateGrievanceStatus } from './grievance.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitGrievance)
  .get(protect, getGrievances);

router.route('/:id')
  .put(protect, updateGrievanceStatus);

export default router;

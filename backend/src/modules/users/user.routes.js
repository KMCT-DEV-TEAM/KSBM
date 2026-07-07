import express from 'express';
import { loginUser, getUserProfile, refreshToken } from './user.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.get('/me', protect, getUserProfile);

export default router;

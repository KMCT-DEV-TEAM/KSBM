import { protect } from '../../middleware/authMiddleware.js';
import express from 'express';
import { streamNotifications, getNotifications, markAsRead, markAllAsRead } from './notification.controller.js';

const router = express.Router();

router.get('/stream', protect, streamNotifications);
router.get('/', protect, getNotifications);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);

export default router;

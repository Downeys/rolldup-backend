import express from 'express';
import { addUserInfo } from '../auth/middleware';
import controller from './controller';
const router = express.Router();

router.get('/', addUserInfo, controller.getNotificationsByUserId);
router.get('/unread', addUserInfo, controller.getUnreadNotificationsByUserId);
router.post('/dismiss', addUserInfo, controller.markNotificationsReadByUserId);
router.get('/subscribe', addUserInfo, controller.subscribe);

export default router;

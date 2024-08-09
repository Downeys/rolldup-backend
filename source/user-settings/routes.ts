import express from 'express';
import multer from 'multer';
import { addUserInfo } from '../auth/middleware';
import controller from './controller';

const router = express.Router();
const upload = multer();

router.post('/username', addUserInfo, controller.updateUsername);
router.post('/pronouns', addUserInfo, controller.updatePronouns);
router.post('/birthdate', addUserInfo, controller.updateBirthdate);
router.post('/privacy', addUserInfo, controller.updatePrivacy);
router.post('/notifications', addUserInfo, controller.updateNotifications);
router.post('/pic', [upload.single('file'), addUserInfo], controller.updateProfilePic);

export default router;

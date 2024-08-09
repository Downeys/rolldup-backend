import express from 'express';
import { addUserInfo } from '../auth/middleware';
import controller from './controller';

const router = express.Router();

router.get('/', addUserInfo, controller.getEndorsementsByUserId);
router.post('/eula', addUserInfo, controller.endorseEula);
router.post('/eula-age', addUserInfo, controller.endorseEulaAndAge);
router.post('/first-login', addUserInfo, controller.endorseFirstLogin)

export default router;

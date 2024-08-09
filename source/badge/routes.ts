import express from 'express';
import { addUserInfo } from '../auth/middleware';
import controller from './controller';

const router = express.Router();

router.get('/user', addUserInfo, controller.listBadgesForUser);

export default router;

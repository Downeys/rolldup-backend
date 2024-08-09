import express from 'express';
import { addUserInfo } from '../auth/middleware';
import controller from './controller'

const router = express.Router();

router.post('/', controller.createNewUser);
router.get('/', addUserInfo, controller.getUserByUserId);


export default router;

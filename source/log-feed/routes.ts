import express from 'express';
import { addUserInfo } from '../auth/middleware';
import controller from './controller';

const router = express.Router();

router.get('/', addUserInfo, controller.getAllStrainLogViews);
router.get('/personal', addUserInfo, controller.getLogsByUsername);
router.get('/rating', addUserInfo, controller.getHighestRatedLogFeed);
router.get('/most-commented', addUserInfo, controller.getMostCommentedLogFeed);
router.get('/most-favorited', addUserInfo, controller.getMostFavoritedLogFeed);
router.get('/search', addUserInfo, controller.getLogsByStrainName);

export default router;

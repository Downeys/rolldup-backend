import express from 'express';
import { addUserInfo } from '../auth/middleware';
import controller from './controller';
import statusController from './status/controller'

const router = express.Router();

router.post('/user-feedback', addUserInfo, controller.createFeedbackRecord);
router.post('/help', addUserInfo, controller.createHelpRequestRecord);
router.post('/report', addUserInfo, controller.createFlaggedContentRecord);

router.get('/user-feedback/status', statusController.getUserFeedbackStatuses);
router.get('/help/status', statusController.getHelpRequestStatuses);
router.get('/report/status', statusController.getFlaggedContentStatuses);
router.get('/user-feedback/status/search', statusController.searchUserFeedbackStatuses);
router.get('/help/status/search', statusController.searchHelpRequestStatuses);
router.get('/report/status/search', statusController.searchFlaggedContentStatuses);

router.put('/user-feedback/status/:id', statusController.updateUserFeedbackStatus);
router.put('/help/status/:id', statusController.updateHelpRequestStatus);
router.put('/report/status/:id', statusController.updateFlaggedContentStatus);

export default router;

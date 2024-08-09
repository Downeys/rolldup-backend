import express from 'express';
import multer from 'multer';
import { addUserInfo } from '../auth/middleware';
import controller from './controller';

const router = express.Router();
const upload = multer();

router.get('/', addUserInfo, controller.getStrainLogById)
router.post('/', [upload.single('file'), addUserInfo], controller.createNewLog);
router.put('/', [upload.single('file'), addUserInfo], controller.updateLog);
router.delete('/', addUserInfo, controller.deletePost);
router.post('/favorite', addUserInfo, controller.addFavorite);
router.delete('/favorite', addUserInfo, controller.removeFavorite);
router.post('/bookmark', addUserInfo, controller.addBookmark);
router.delete('/bookmark', addUserInfo, controller.removeBookmark);
router.post('/comment', addUserInfo, controller.addCommentToLog);
router.get('/strain', controller.searchStrainByName)

export default router;

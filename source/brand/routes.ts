import express from 'express';
import Controller from './controller';

const router = express.Router();

router.get('/', Controller.getBrands)
router.post('/', Controller.createBrand)

export default router;

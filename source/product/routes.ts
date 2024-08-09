import express from 'express';
import Controller from './controller';

const router = express.Router();

router.get('/', Controller.getProducts)
router.post('/', Controller.createProduct)

export default router;

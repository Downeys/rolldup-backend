import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import Service from './service';

const NAMESPACE = 'products-controller';

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting products');
    const searchStr: string = '' + req.query.searchStr;
    const products = await Service.getProducts(searchStr);
    return res.status(200).json({
        result: products
    });
};

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Create product');
    const newProduct = await Service.createProductWithDetails(req.body);
    return res.status(200).json({
        result: newProduct
    });
};
export default { getProducts, createProduct }
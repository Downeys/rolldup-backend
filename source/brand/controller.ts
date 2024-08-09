import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import Service from './service';

const NAMESPACE = 'brand-controller';

const getBrands = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting brands');
    const searchStr: string = '' + req.query.searchStr;
    const brands = await Service.getBrands(searchStr);
    return res.status(200).json({
        result: brands
    });
};

const createBrand = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Creating new brand');
    const newBrand = await Service.createBrandWithDetails(req.body);
    return res.status(200).json({
        result: newBrand
    });
};

export default { getBrands, createBrand }
import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import Service from './service';

const NAMESPACE = 'purchase-locations-controller';

const getPurchaseLocations = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting purchase locations');
    const searchStr: string = '' + req.query.searchStr;
    const locations = await Service.getPurchaseLocations(searchStr);
    return res.status(200).json({
        result: locations
    });
};

export default { getPurchaseLocations }
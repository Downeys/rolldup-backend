import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import service from './service';

const NAMESPACE = 'user-view-controller';

const getUserByUserId = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting user and users settings by username');
    const userId: number = +(req.body.callingUser?.userId || -1);
    const user = await service.getUserWithSettingsByUserId(userId);
    return res.status(200).json({
        result: {
            ...user,
            appRoles: req.body.callingUser?.appRoles || [],
        },
    });
};

const createNewUser = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Creating new user');
    const userId = await service.createUserInDb(req.body);

    return res.status(200).json({
        result: userId
    });
};

export default { getUserByUserId, createNewUser };

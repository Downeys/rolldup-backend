import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import service from './service';

const NAMESPACE = 'user-endorsements-controller';

const endorseFirstLogin = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Endorsing first login');
    const userId: number = +req.body.callingUser.userId;
    const endorsements = await service.endorseFirstLogin(userId);
    return res.status(200).json({
        result: endorsements
    });
};

const endorseEulaAndAge = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Endorsing EULA and age');
    const userId: number = +req.body.callingUser.userId;
    const endorsements = await service.endorseEulaAndAge(userId);
    return res.status(200).json({
        result: endorsements
    });
};

const endorseEula = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Endorsing Eula');
    const userId: number = +req.body.callingUser.userId;
    const endorsements = await service.endorseEula(userId);
    return res.status(200).json({
        result: endorsements
    });
};

const getEndorsementsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting endorsements by username');
    const userId: number = +req.body.callingUser.userId;
    const endorsements = await service.getEndorsementsByUserId(userId);
    return res.status(200).json({
        result: endorsements
    });
};

export default { getEndorsementsByUserId, endorseEula, endorseEulaAndAge, endorseFirstLogin };
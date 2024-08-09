import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import service from './service'

const NAMESPACE = 'user-feedback-controller';

const createHelpRequestRecord = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Creating Help Request Record');

    const feedbackId = await service.createHelpRequestRecordInDb(req.body);
    return res.status(200).json({
        result: feedbackId
    });
};

const createFlaggedContentRecord = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Creating Reported Content Record');

    const feedbackId = await service.createFlaggedConentRecordInDb(req.body);
    return res.status(200).json({
        result: feedbackId
    });
};

const createFeedbackRecord = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Creating Feedback Record');

    const feedbackId = await service.createUserFeedbackRecordInDb(req.body);
    return res.status(200).json({
        result: feedbackId
    });
};

export default { createFeedbackRecord, createHelpRequestRecord, createFlaggedContentRecord };

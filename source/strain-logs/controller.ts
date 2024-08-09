import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import service from './service';
import FeedService from '../log-feed/service';
import { AdB2cUser } from '../auth/service';

const NAMESPACE = 'strain-logs-view-controller';

const getStrainLogById = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Searching strain by name');
    const id: number = +(req.query.id || -1);
    const userId = req.body.callingUser?.userId
    try {
        const log = await FeedService.getStrainLogByLogId(userId, id);
        return res.status(200).json({
            result: log
        });
    } catch (e: any) {
        if (e.message === "Not allowed") {
            return res.status(401).json({
                message: e.message
            });
        } else {
            return res.status(500).json({
                message: e.message
            })
        }
    }

}

const searchStrainByName = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Searching strain by name');
    const name: string = '' + req.query.name;
    const logs = await service.searchStrainByName(name);
    return res.status(200).json({
        result: logs
    });
};

const addFavorite = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Adding favorite from strain log');
    const returnVal = service.addFavorite(req.body);
    return res.status(200).json({
        result: returnVal
    });
};

const removeFavorite = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Removing favorite from strain log');
    const returnVal = service.removeFavorite(req.body);
    return res.status(200).json({
        result: returnVal
    });
};

const addBookmark = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Adding bookmark to strain log');
    const returnVal = service.createBookmarkRecordInDb(req.body.callingUser.userId, req.body.logId);
    return res.status(200).json({
        result: returnVal
    });
};

const removeBookmark = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Removing bookmark from strain log');
    const returnVal = service.removeBookmarkRecordInDb(req.body.callingUser.userId, req.body.logId);
    return res.status(200).json({
        result: returnVal
    });
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Deleting strain log');
    const user = req.body.callingUser;
    const logId = req.body.logId;
    if (user) {
        const returnVal = service.deleteStrainLog(logId, user as AdB2cUser);
        return res.status(200).json({
            result: returnVal
        });
    }
    return res.status(401);
};

const addCommentToLog = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Adding comment to a log');
    const logId = await service.createNewCommentInDb(req.body);

    return res.status(200).json({
        result: logId
    });
};

const updateLog = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Updating strain log');
    let logId;
    try {
        logId = await service.updateStrainLog(req.body, req.file);
    } catch (e: any) {
        return res.status(500).json({
            error: e.message
        });
    }

    return res.status(200).json({
        result: logId
    });
};

const createNewLog = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Creating new strain log');
    let logId;
    try {
        logId = await service.createNewLogInDb(req.body, req.file);
    } catch (e: any) {
        return res.status(500).json({
            error: e.message
        });
    }

    return res.status(200).json({
        result: logId
    });
};

export default { createNewLog, addFavorite, removeFavorite, addCommentToLog, addBookmark, removeBookmark, searchStrainByName, deletePost, updateLog, getStrainLogById };

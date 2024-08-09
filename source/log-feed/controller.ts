import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import service from './service';

const NAMESPACE = 'log-feed-repo';

const getAllStrainLogViews = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting all strain log views');
    const userId: number = +(req.body.callingUser?.userId || -1);
    const limit: number = +(req.query.limit || 10);
    const cursor: string = '' + req.query.cursor
    const logViews = await service.getAllLogViews(userId, cursor, limit);
    return res.status(200).json({
        result: logViews
    });
};

const getLogsByStrainName = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting logs by strain name');
    const strainName: string = '' + req.query.searchStr;
    const userId: number = +(req.body.callingUser?.userId || -1);
    const limit: number = +(req.query.limit || 10);
    const cursor: string = '' + req.query.cursor
    const logViews = await service.getLogViewsByStrainName(strainName, userId, cursor, limit);
    return res.status(200).json({
        result: logViews
    });
};

const getHighestRatedLogFeed = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting highest rated log feed');
    const userId: number = +(req.body.callingUser?.userId || -1);
    const limit: number = +(req.query.limit || 10);
    const cursor: string = '' + req.query.cursor;
    const logViews = await service.getHighestRatedFeed(userId, cursor, limit);
    return res.status(200).json({
        result: logViews
    });
}

const getMostCommentedLogFeed = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting most commented log feed');
    const userId: number = +(req.body.callingUser?.userId || -1);
    const limit: number = +(req.query.limit || 10);
    const cursor: string = '' + req.query.cursor;
    const logViews = await service.getMostCommentedFeed(userId, cursor, limit);
    return res.status(200).json({
        result: logViews
    });
}

const getMostFavoritedLogFeed = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting most commented log feed');
    const userId: number = +(req.body.callingUser?.userId || -1);
    const limit: number = +(req.query.limit || 10);
    const cursor: string = '' + req.query.cursor;
    const logViews = await service.getMostFavoritedFeed(userId, cursor, limit);
    return res.status(200).json({
        result: logViews
    });
}

const getLogsByUsername = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting strain log views by user id');
    const userId: number = +(req.body.callingUser?.userId || -1);
    const logViews = await service.getLogViewsByUsername(userId);

    return res.status(200).json({
        result: logViews
    });
};

export default { getAllStrainLogViews, getLogsByUsername, getHighestRatedLogFeed, getMostCommentedLogFeed, getMostFavoritedLogFeed, getLogsByStrainName };

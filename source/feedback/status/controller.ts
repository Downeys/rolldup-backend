import { Request, Response, NextFunction } from 'express';
import logging from '../../config/logging';
import service from './service'

const NAMESPACE = 'user-feedback-controller';

const getHelpRequestStatuses = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting help request statuses');

    const cursor = req.query.cursor || '';
    const limit = +(req.query.limit || 10);
    const status = '' + req.query.status

    const statuses = await service.getHelpRequestStatuses(cursor, limit, status);
    return res.status(200).json({
        result: statuses
    });
};

const getUserFeedbackStatuses = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting user feedback statuses');

    const cursor = req.query.cursor || '';
    const limit = +(req.query.limit || 10);
    const status = '' + req.query.status

    const statuses = await service.getUserFeedbackStatuses(cursor, limit, status);
    return res.status(200).json({
        result: statuses
    });
};

const getFlaggedContentStatuses = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting flagged content statuses');

    const cursor = req.query.cursor || '';
    const limit = +(req.query.limit || 10);
    const status = '' + req.query.status

    const statuses = await service.getFlaggedContentStatuses(cursor, limit, status);
    return res.status(200).json({
        result: statuses
    });
};

const updateFlaggedContentStatus = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Updating flagged content status');

    const id = +(req.params.id || -1);
    const category = '' + req.body.category;
    const action = '' + req.body.action;
    const notes = '' + req.body.notes;
    const status = '' + req.body.status;

    const statuses = await service.updateFlaggedContentStatus(id, category, action, notes, status);
    return res.status(200).json({
        result: statuses
    });
};

const updateHelpRequestStatus = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Updating help request status');

    const id = +(req.params.id || -1);
    const category = '' + req.body.category;
    const action = '' + req.body.action;
    const notes = '' + req.body.notes;
    const status = '' + req.body.status;

    const statuses = await service.updateHelpRequestStatus(id, category, action, notes, status);
    return res.status(200).json({
        result: statuses
    });
};

const updateUserFeedbackStatus = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Updating user feedback status');

    const id = +(req.params.id || -1);
    const category = '' + req.body.category;
    const action = '' + req.body.action;
    const notes = '' + req.body.notes;
    const status = '' + req.body.status;

    const statuses = await service.updateUserFeedbackStatus(id, category, action, notes, status);
    return res.status(200).json({
        result: statuses
    });
};

const searchHelpRequestStatuses = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Search help request statuses');

    const searchTerm = '' + req.query.searchTerm

    const statuses = await service.searchHelpRequestStatuses(searchTerm);
    return res.status(200).json({
        result: statuses
    });
};

const searchUserFeedbackStatuses = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Search user feedback statuses');

    const searchTerm = '' + req.query.searchTerm

    const statuses = await service.searchUserFeedbackStatuses(searchTerm);
    return res.status(200).json({
        result: statuses
    });
};


const searchFlaggedContentStatuses = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Search flagged content statuses');

    const searchTerm = '' + req.query.searchTerm

    const statuses = await service.searchFlaggedContentStatuses(searchTerm);
    return res.status(200).json({
        result: statuses
    });
};

export default {
    getHelpRequestStatuses,
    getUserFeedbackStatuses,
    getFlaggedContentStatuses,
    updateFlaggedContentStatus,
    updateHelpRequestStatus,
    updateUserFeedbackStatus,
    searchHelpRequestStatuses,
    searchUserFeedbackStatuses,
    searchFlaggedContentStatuses
};
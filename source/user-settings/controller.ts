import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import { updateUsernameSvc, updatePronounsSvc, updateBirthdateSvc, updatePrivacySvc, updateNotificationsSvc, updateProfilePicSvc } from './service';

const NAMESPACE = 'user-settings-controller';

const updateNotifications = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Updating display');
    await updateNotificationsSvc(req.body);
    return res.status(200).json({
        result: 'Success'
    });
};

const updatePrivacy = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Updating privacy');
    await updatePrivacySvc(req.body);
    return res.status(200).json({
        result: 'Success'
    });
};

const updateBirthdate = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Updating birthdate');
    await updateBirthdateSvc(req.body);
    return res.status(200).json({
        result: 'Success'
    });
};

const updatePronouns = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Updating pronouns');
    await updatePronounsSvc(req.body);
    return res.status(200).json({
        result: 'Success'
    });
};

const updateUsername = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Updating username');
    await updateUsernameSvc(req.body);
    return res.status(200).json({
        result: 'Success'
    });
};

const updateProfilePic = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Updating profile pic');
    const imageUrl = await updateProfilePicSvc(req.body, req.file);

    return res.status(200).json({
        result: imageUrl
    });
};

export default { updateUsername, updatePronouns, updateBirthdate, updatePrivacy, updateNotifications, updateProfilePic };

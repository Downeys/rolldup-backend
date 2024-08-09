import { Request, Response } from 'express';
import service from './service';

const listBadgesForUser = async (req: Request, res: Response) => {
    const userId = req.body.callingUser?.userId;

    if (!userId) {
        return res.status(403).json({
            message: 'could not determine user',
        });
    }

    const badges = await service.listBadgesForUser(userId);
    return res.status(200).json({
        result: badges,
    });
};

export default {
    listBadgesForUser,
};

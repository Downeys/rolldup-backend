import { Request, Response, NextFunction } from 'express';

const NAMESPACE = 'healthcheck-controller';

const healthcheck = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: 'edge-dev is available'
    });
};

export default { healthcheck };

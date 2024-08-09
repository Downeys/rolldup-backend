import { NextFunction, Request, Response } from "express";
import logging from "../config/logging";
import service from "./service";

const NAMESPACE = 'auth-middleware';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies['access_token'];
    if (accessToken) {
        const userContext = await service.userContextFromToken(accessToken);
        if (userContext.authenticated) {
            req.body.callingUser = { ...userContext.loginUser }
            next();
        }
        return res.status(403).json({
            authenticated: false,
            message: 'token did not validate',
        });
    } else {
        return res.status(401).json({
            authenticated: false,
            message: 'no token provided',
        });
    }
}

export const addUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies['access_token'];
    if (accessToken) {
        let userContext;
        try {
            userContext = await service.userContextFromToken(accessToken);
        } catch (e) {
            logging.error(NAMESPACE, 'failed to exchange token for user context')
        }
        if (userContext?.authenticated) req.body.callingUser = { ...userContext.loginUser }
    }
    next();
}

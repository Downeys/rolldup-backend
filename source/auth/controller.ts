import { Request, Response, NextFunction, CookieOptions } from 'express';
import logging from '../config/logging';
import eventuallyConfig from '../config/config';
import service, { OAuthTokens } from './service';

const NAMESPACE = 'auth-controller';

// aka 10(ish) years; tokens will expire prior to then, which is okay
// additionally, a logout endpoint will unset the cookies
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 365 * 10;

const scopes = (clientId: string) => `offline_access openid ${clientId}`

const exchangeCodeForAuthCookies = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'exchange auth code for tokens');

    const clientId = req.body.clientId;
    const code = req.body.code;
    const redirectUri = req.body.redirectUri;
    const codeVerifier = req.body.codeVerifier;
    const origin = req.headers.origin || '';

    const tokens = await service.exchangeCodeForTokens({
        clientId,
        code,
        redirectUri,
        codeVerifier,
        origin,
        scope: scopes(clientId),
    });

    return await giveCookies(clientId, tokens, req, res);
};

const exchangeRefreshTokenForAuthCookies = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'exchange refresh token for tokens');
    const clientId = req.cookies['client_id'];
    const refreshToken = req.cookies['refresh_token'];
    const origin = req.headers.origin || '';

    const tokens = await service.exchangeRefreshTokenForTokens({
        clientId,
        refreshToken,
        origin,
        scope: scopes(clientId),
    });

    return await giveCookies(clientId, tokens, req, res);
};

export const removeCookies = async (req: Request, res: Response, next: NextFunction) => {
    return res.clearCookie('client_id', await refreshCookieOptions())
        .clearCookie('refresh_token', await refreshCookieOptions())
        .clearCookie('access_token', await commonCookieOptions())
        .sendStatus(204);
}

const giveCookies = async (clientId: string, tokens: OAuthTokens, req: Request, res: Response) => {
    const userContext = await service.userContextFromToken(tokens.access_token);
    return res.cookie('access_token', tokens.access_token, await commonCookieOptions())
        .cookie('client_id', clientId, await refreshCookieOptions())
        .cookie('refresh_token', tokens.refresh_token, await refreshCookieOptions())
        .status(200).json(userContext);
}

const commonCookieOptions = async () => {
    const config = await eventuallyConfig;
    return {
        httpOnly: true,
        domain: config.auth.cookieDomain,
        secure: config.auth.secureCookies,
        maxAge: COOKIE_MAX_AGE,
    };
}

const refreshCookieOptions = async () => ({
    ...await commonCookieOptions(),
    path: '/auth/exchange-refresh-token-for-auth-cookies',
});

const extractUserDataFromToken = async (req: Request, res: Response) => {
    const accessToken = req.cookies['access_token'];
    if (accessToken) {
        const userContext = await service.userContextFromToken(accessToken);
        if (userContext.authenticated) {
            return res.status(200).json(userContext);
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

export default {
    exchangeCodeForAuthCookies,
    exchangeRefreshTokenForAuthCookies,
    extractUserDataFromToken,
    removeCookies,
};

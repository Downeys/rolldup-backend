import eventuallyConfig from '../config/config';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import * as jose from 'jose';
import logging from '../config/logging';
import repo from './repo';

const NAMESPACE = 'auth-service';

interface CodeForTokenRequest {
    clientId: string;
    code: string;
    redirectUri: string;
    codeVerifier: string;
    origin: string;
    scope: string;
}

interface RefreshTokenRequest {
    clientId: string;
    scope: string;
    refreshToken: string;
    origin: string;
}

export interface OAuthTokens {
    access_token: string;
    refresh_token: string;
}

export type AppRole = "ADMIN";

export interface AdB2cUser {
    sub: string;
    userId: number;
    createdAt: Date;
    appRoles: AppRole[];
}

export interface UserContext {
    authenticated: boolean;
    tokenClaims?: { [name: string]: string };
    loginUser?: AdB2cUser;
}

const exchangeCodeForTokens = async (request: CodeForTokenRequest): Promise<OAuthTokens> =>
    callTokenEndpoint(request.origin, codeForTokenRequestToPostBody(request));

const exchangeRefreshTokenForTokens = async (request: RefreshTokenRequest): Promise<OAuthTokens> =>
    callTokenEndpoint(request.origin, refreshTokenRequestToPostBody(request));

const userContextFromToken = async (accessToken: string): Promise<UserContext> => {
    const config = await eventuallyConfig;
    const JWKS = jose.createRemoteJWKSet(new URL(config.auth.jwksUri));
    try {
        const { payload } = await jose.jwtVerify(accessToken, JWKS, {
            issuer: config.auth.tokenIssuer,
            audience: config.auth.tokenAudience,
        });

        const adB2cUser = await repo.createOrGetUserFromClaims(payload as any);

        return {
            authenticated: true,
            tokenClaims: payload as any,
            loginUser: adB2cUser,
        };
    } catch (e) {
        logging.info(NAMESPACE, 'error decoding jwt', e);
        return {
            authenticated: false,
        };
    }
}

const callTokenEndpoint = async (origin: string, requestBody: string): Promise<OAuthTokens> => {
    const config = await eventuallyConfig;
    let body = {};
    try {
        const response = await fetch(config.auth.tokenUrl, {
            method: 'POST',
            body: requestBody,
            headers: {
                'Origin': origin,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        body = await response.json();
    } catch (e: any) {
        logging.error(NAMESPACE, 'Token exchange failed: ' + e.message)
    }
    return body as OAuthTokens;
}

const codeForTokenRequestToPostBody = (request: CodeForTokenRequest): string =>
    new URLSearchParams({
        'client_id': request.clientId,
        'scope': request.scope,
        'redirect_uri': request.redirectUri,
        'grant_type': 'authorization_code',
        'code': request.code,
        'code_verifier': request.codeVerifier,
    }).toString();

const refreshTokenRequestToPostBody = (request: RefreshTokenRequest): string =>
    new URLSearchParams({
        'client_id': request.clientId,
        'scope': request.scope,
        'refresh_token': request.refreshToken,
        'grant_type': 'refresh_token',
    }).toString();

export default {
    exchangeCodeForTokens,
    exchangeRefreshTokenForTokens,
    userContextFromToken,
};
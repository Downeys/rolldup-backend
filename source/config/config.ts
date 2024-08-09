import dotenv from 'dotenv';
import axios from 'axios';
import logging from './logging';
import { fetchKeyVaultConfigOverrides } from '../azure/keyvault';

dotenv.config();

interface IPGProps {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl: boolean;
}

interface IAuth {
    tokenUrl: string;
    cookieDomain: string;
    secureCookies: boolean;
    jwksUri: string;
    tokenIssuer: string;
    tokenAudience: string;
    corsOrigins: string[];
}

async function loadAllConfigs(): Promise<any> {
    const azureOverrides = await fetchKeyVaultConfigOverrides();
    const HOST = process.env.PG_HOST || 'localhost';
    const PORT = Number(process.env.PG_PORT) || 5432;
    const DATABASE = process.env.PG_DATABASE || 'postgres';
    const USERNAME = process.env.PG_USERNAME || 'postgres';
    const PASSWORD = azureOverrides.PG_PASSWORD || process.env.PG_PASSWORD || 'ciefD8mf421!';
    const SSL = process.env.SSL_MODE == 'true';

    const BLOB_CONNECTION_STRING =
        azureOverrides.BLOB_CONNECTION_STRING ||
        process.env.BLOB_CONNECTION_STRING || 'DefaultEndpointsProtocol=https;AccountName=backenddev50;AccountKey=if-you-want-to-create-blobs-locally-set-BLOB_CONNECTION_STRING-env-var;EndpointSuffix=core.windows.net';
    const PHOTO_CONTENT_URL = process.env.PHOTO_CONTENT_URL || 'https://backenddev50.blob.core.windows.net/photos/';
    const PROFILE_PIC_URL = process.env.PROFILE_PIC_URL || 'https://backenddev50.blob.core.windows.net/profiles/';
    const IMAGE_CONTAINER = process.env.IMAGE_CONTAINER || 'photos';
    const PROFILE_PIC_CONTAINER = process.env.PROFILE_PIC_CONTAINER || 'profiles';

    const AXIOS_QUERY = async (queryString: string, NAMESPACE: string) => {
        try {
            let res = await axios.get(queryString);
            return res.data;
        } catch (err: any) {
            logging.error(NAMESPACE, err.message, err);
            return;
        }
    };

    const AXIOS_POST = async (queryString: string, body: any, NAMESPACE: string) => {
        try {
            let res = await axios.post(queryString, body);
            return res.data;
        } catch (err: any) {
            logging.error(NAMESPACE, err.message, err);
            return;
        }
    };

    const PG: IPGProps = {
        host: HOST,
        port: PORT,
        database: DATABASE,
        username: USERNAME,
        password: PASSWORD,
        ssl: SSL
    };

    const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
    const SERVER_PORT = process.env.SERVER_PORT || 8080;

    const SERVER = {
        hostname: SERVER_HOSTNAME,
        port: SERVER_PORT
    };

    const BLOB = {
        connectionString: BLOB_CONNECTION_STRING,
        photoContentUrl: PHOTO_CONTENT_URL,
        profilePicUrl: PROFILE_PIC_URL,
        imageContainer: IMAGE_CONTAINER,
        profilePicContainer: PROFILE_PIC_CONTAINER
    };

    const auth: IAuth = {
        tokenUrl: process.env.AUTH_TOKEN_URL || "https://dev50rolldupappcom.b2clogin.com/dev50rolldupappcom.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN/oauth2/v2.0/token",
        cookieDomain: process.env.COOKIE_DOMAIN || "localhost",
        secureCookies: process.env.SECURE_COOKIES === "true" || false,
        jwksUri: process.env.JWKS_URI || "https://dev50rolldupappcom.b2clogin.com/dev50rolldupappcom.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN/discovery/v2.0/keys",
        tokenIssuer: process.env.TOKEN_ISSUER || "https://dev50rolldupappcom.b2clogin.com/4b8fd093-220e-481d-a813-c2d92dc44e6b/v2.0/",
        tokenAudience: process.env.TOKEN_AUDIENCE || "ae43b5e0-1bcd-48ad-ab91-8a9f58712ade",
        corsOrigins: process.env.CORS_ALLOWED_ORIGIN?.split(",") || ["http://localhost:3000", "http://localhost:3001"]
    }

    const computerVision = {
        accessKey: azureOverrides.COMPUTER_VISION_ACCESS_KEY || process.env.COMPUTER_VISION_ACCESS_KEY,
        endpoint: process.env.COMPUTER_VISION_ENDPOINT,
    };

    const config = {
        server: SERVER,
        pg: PG,
        blob: BLOB,
        auth: auth,
        computerVision,
    };
    return config;
}

export default loadAllConfigs();

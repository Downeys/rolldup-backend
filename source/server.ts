import "./tracing";
import http from 'http';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from './config/config';
import logging from './config/logging';
import healthcheckRoutes from './healthcheck/routes';
import logFeedRoutes from './log-feed/routes';
import strainLogRoutes from './strain-logs/routes';
import userEndorsementRoutes from './user-endorsements/routes';
import userSettingsRoutes from './user-settings/routes';
import usersRoutes from './users/routes';
import feedbackRoutes from './feedback/routes';
import notificationRoutes from './notifications/routes';
import authRoutes from './auth/routes';
import badgeRoutes from './badge/routes';
import purchaseLocationRoutes from './purchase-locations/routes'
import brandRoutes from './brand/routes'
import productRoutes from './product/routes'
import { startConsumers } from './kafka/consumers';

const NAMESPACE = 'Server';
const app = express();

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logging.error(NAMESPACE, err.stack)
    res.status(500).send('Server errer: ' + err.message)
})

//logging
app.use((req, res, next) => {
    if (!req.url.match('/healthcheck')) {
        const loggingContext = { method: req.method, url: req.url, ip: req.socket.remoteAddress };
        logging.debug(NAMESPACE, 'received request', loggingContext);

        res.on('finish', () => {
            logging.info(NAMESPACE, 'produced response', { ...loggingContext, status: res.statusCode });
        });
    }

    next();
});

//parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//rules
app.use(cors(async (req, callback) => {
    const eventuallyConfig = await config;
    callback(null, {
        origin: eventuallyConfig.auth.corsOrigins,
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
            'Cookie',
            'traceparent',
            'request-id',
            'Pragma',
            'cache-control',
        ],
        credentials: true,
        methods: ['GET', 'PATCH', 'DELETE', 'POST', 'PUT'],
    });
}));

//routes
app.use('/logs', strainLogRoutes);
app.use('/feed', logFeedRoutes);
app.use('/users', usersRoutes);
app.use('/settings', userSettingsRoutes);
app.use('/endorsements', userEndorsementRoutes);
app.use('/healthcheck', healthcheckRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/notifications', notificationRoutes);
app.use('/auth', authRoutes);
app.use('/badges', badgeRoutes);
app.use('/purchase-locations', purchaseLocationRoutes);
app.use('/brand', brandRoutes);
app.use('/product', productRoutes)

//404 error handler
app.use((req, res, next) => {
    const error = new Error('Not Found');

    return res.status(404).json({
        message: error.message
    });
});

async function main() {
    const resolvedConfig = await config;
    const httpServer = http.createServer(app);
    httpServer.listen(resolvedConfig.server.port, () => logging.info(NAMESPACE, `Server is running on ${resolvedConfig.server.hostname}: ${resolvedConfig.server.port}`));

    startConsumers();
}

main();

import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import service from './service';
import { addNotificationListener, removeNotificationListener } from '../kafka/consumers';

const NAMESPACE = 'notifications-controller';

const getNotificationsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting notifications by username');
    const userId: number = +(req.body.callingUser?.userId || -1);
    const limit: number = +(req.query.limit || 10);
    const cursor: string = '' + req.query.cursor
    const notis = await service.getNotificationsByUserId(userId, cursor, limit);
    return res.status(200).json({
        result: notis
    });
};

const getUnreadNotificationsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Getting unread notifications by username');
    const userId: number = +(req.body.callingUser?.userId || -1);
    const notis = await service.getUnreadNotificationsByUserId(userId);
    return res.status(200).json({
        result: notis
    });
};

const markNotificationsReadByUserId = async (req: Request, res: Response) => {
    if (!req.body.callingUser) {
        res.sendStatus(401);
        return;
    }

    logging.info(NAMESPACE, 'Marking notifications as read');
    const notificationIds: number[] = req.body.notificationIds;
    const userId: number = req.body.callingUser.userId;
    await service.markNotificationsAsRead(userId, notificationIds);
    return res.status(200).json({});
};

const subscribe = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.callingUser) {
        res.sendStatus(401);
        return;
    }
    const userId = req.body.callingUser.userId;
    const listenerId = `notifications-${userId}`;
    logging.info(NAMESPACE, 'subscribing to notifications for user', { userId, listenerId });
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    res.write("event: heartbeat\n");
    res.write("data: {}\n\n");

    addNotificationListener(listenerId, async event => {
        const notification = await service.constructNotificationView(event);
        if (notification.recipientId === userId) {
            logging.info(NAMESPACE, "streaming notification to user", { type: notification.type, userId, listenerId });
            res.write("event: notification\n")
            res.write(`data: ${JSON.stringify(notification)}\n\n`)
        }
    });

    const intervalId = setInterval(() => {
        res.write("event: heartbeat\n");
        res.write("data: {}\n\n");
    }, 10_000);

    res.on('close', () => {
        logging.info(NAMESPACE, "closing subscription", { userId, listenerId });
        removeNotificationListener(listenerId);
        clearInterval(intervalId);
        res.end();
    });
};

export default {
    getNotificationsByUserId,
    getUnreadNotificationsByUserId,
    subscribe,
    markNotificationsReadByUserId,
};

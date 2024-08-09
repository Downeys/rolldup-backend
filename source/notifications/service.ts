import repo from './repo';
import userRepo from '../users/repo';
import cursorUtils from '../utils/cursor-utils';
const hstore = require('pg-hstore')();

const NAMESPACE = 'notifications-service';

interface INotificationView {
    id: number;
    type: string;
    message: string;
    engager: string;
    logId?: number;
    isRead: boolean;
    recipientId: number;
    additionalProperties: INotiProperties;
    timestamp: string;
}

const constructNotificationViews = async (notifications: any[]) => {
    return await Promise.all(notifications.map(constructNotificationView));
};

const constructNotificationView = async (notification: any): Promise<INotificationView> => {
    const engager = (await userRepo.getUserByUserId(notification.engager_id)) as any[];
    return {
        id: notification.noti_id,
        type: notification.noti_type,
        message: notification.noti_message,
        engager: engager[0]?.username,
        logId: notification.log_id,
        isRead: notification.is_read,
        recipientId: notification.recipient_id,
        additionalProperties: hstore.parse(notification.additional_properties),
        timestamp: notification.noti_timestamp,
    }
};

export interface INotiProperties {
    [key: string]: string;
}

export interface INewNoti {
    logId?: number;
    engagerId?: number;
    recipientId: number;
    message: string;
    type: string;
    additionalProperties?: INotiProperties;
}

export const createNotification = async (noti: INewNoti) => {
    const newNoti = { ...noti };
    return await repo.createNewNotification(newNoti);
};

export const getNotificationsByUserId = async (userId: number, cursor: string, limit: number) => {
    const notis = (await repo.getNotificationsByUserId(userId, cursor, limit)) as any[];
    const notiViews = await constructNotificationViews(notis);
    const newCursor = await cursorUtils.constructCursor(notis, "noti_timestamp", "noti_id")
    notis.forEach((noti) => {
        repo.markNotificationRead(noti.noti_id)
    })
    return { notiViews, cursor: newCursor }
};

export const getUnreadNotificationsByUserId = async (userId: number) => {
    const notis = (await repo.getUnreadNotificationsByUserId(userId)) as any[];
    return await constructNotificationViews(notis);
};

const markNotificationsAsRead = async (userId: number, notificationIds: number[]) => {
    await repo.markNotificationsAsRead(userId, notificationIds);
};

export default {
    createNotification,
    getNotificationsByUserId,
    constructNotificationView,
    getUnreadNotificationsByUserId,
    markNotificationsAsRead
};
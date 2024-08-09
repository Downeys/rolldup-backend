import { QueryResult } from 'pg';
import logging from '../config/logging';
import pool from '../config/pgrepo';
import cursorUtils from '../utils/cursor-utils';
import { INewNoti } from './service';
const hstore = require('pg-hstore')();

const NAMESPACE = 'notifications-repo';

const markNotificationRead = async (notiId: number) => {
    logging.info(NAMESPACE, 'Marking a notification as read');
    const QUERY = `UPDATE notifications SET is_read=true WHERE noti_id=$1;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [notiId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
}

const createNewNotification = async (newNotification: INewNoti) => {
    logging.info(NAMESPACE, 'Creating new notification log');
    const { logId, engagerId, recipientId, type, message, additionalProperties } = newNotification;
    const insertableProperties = additionalProperties || {};
    const QUERY = `INSERT INTO notifications (log_id, engager_id, recipient_id, noti_type, noti_message, additional_properties, is_read, noti_timestamp) values ($1, $2, $3, $4, $5, $6, false, CURRENT_TIMESTAMP);`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [logId, engagerId, recipientId, type, message, hstore.stringify(insertableProperties)]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const getUnreadNotificationsByUserId = async (userId: number) => {
    logging.info(NAMESPACE, 'Getting unread notifications by username');
    const QUERY = `SELECT * FROM notifications where recipient_id = $1 AND is_read = false;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const getNotificationsByUserId = async (userId: number, cursor: any, limit: number) => {
    logging.info(NAMESPACE, 'Getting notifications by username');

    let decodedCursor, QUERY;
    try {
        decodedCursor = await cursorUtils.decodeCursor(cursor);
    } catch (e) {
        logging.error(NAMESPACE, "An error occurred when getting strain logs. Unable to parse cursor.")
    }

    if (decodedCursor) {
        QUERY = `select noti_id,
        log_id,
        noti_type,
        noti_message,
        is_read,
        is_read_timestamp,
        engager_id,
        recipient_id,
        additional_properties,
        COALESCE(noti_timestamp, 'epoch') as noti_timestamp from notifications
        where (recipient_id = $1 AND COALESCE(noti_timestamp, 'epoch') < $2::TIMESTAMP) OR (recipient_id = $1 AND COALESCE(noti_timestamp, 'epoch') <= $2::TIMESTAMP AND noti_id < $3)
        ORDER BY COALESCE(noti_timestamp, 'epoch') DESC, noti_id DESC LIMIT $4;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [userId, decodedCursor.noti_timestamp, decodedCursor.noti_id, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    } else {
        QUERY = `select noti_id,
        log_id,
        noti_type,
        noti_message,
        is_read,
        is_read_timestamp,
        engager_id,
        recipient_id,
        additional_properties,
        COALESCE(noti_timestamp, 'epoch') as noti_timestamp from notifications
        where recipient_id = $1
        ORDER BY noti_timestamp DESC, noti_id DESC LIMIT $2;`;

        try {
            const response: QueryResult = await (await pool).query(QUERY, [userId, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    }
};

const markNotificationsAsRead = async (userId: number, notificationIds: number[]) => {
    logging.info(NAMESPACE, 'Marking notifications as read', { userId, notificationIds });
    try {
        const wat = await (await pool).query('UPDATE notifications SET is_read=true WHERE recipient_id = $1 AND noti_id = any($2::int[]);', [userId, notificationIds]);
        logging.info(NAMESPACE, 'updated notifications', { count: wat.rows.length })
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
    }
}

export default {
    getNotificationsByUserId,
    createNewNotification,
    getUnreadNotificationsByUserId,
    markNotificationRead,
    markNotificationsAsRead,
};

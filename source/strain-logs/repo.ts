import { QueryResult } from 'pg';
import logging from '../config/logging';
import pool from '../config/pgrepo';

const NAMESPACE = 'strain-logs-repo';

const searchStrainByName = async (name: string) => {
    logging.info(NAMESPACE, 'Searching strain by name');
    const searchStr = `%${name}%`;
    const QUERY = `SELECT name FROM strains WHERE name ILIKE $1 GROUP BY name limit 5;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [searchStr]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const getBookmarksByDetails = async (userId: number, logId: number) => {
    logging.info(NAMESPACE, 'Getting bookmarks by details');
    const QUERY = `SELECT bookmark_id FROM bookmark_logs where user_id=$1 AND log_id=$2`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [userId, logId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const deleteBookmark = async (bookmarkId: number) => {
    logging.info(NAMESPACE, 'Deleting bookmark record');
    const QUERY = `DELETE FROM bookmark_logs WHERE bookmark_id=$1`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [bookmarkId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const createBookmark = async (userId: number, logId: number) => {
    logging.info(NAMESPACE, 'Creating new bookmark record');
    const QUERY = `INSERT INTO bookmark_logs (user_id, log_id, time_logged) VALUES($1, $2, current_timestamp)`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [userId, logId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const getFavoritesByDetails = async (userId: number, logId: number) => {
    logging.info(NAMESPACE, 'Getting favorites by details');
    const QUERY = `SELECT favorite_id FROM favorite_logs where user_id=$1 AND log_id=$2`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [userId, logId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const deleteFavorite = async (favoriteId: number) => {
    logging.info(NAMESPACE, 'Deleting favorite record');
    const QUERY = `DELETE FROM favorite_logs WHERE favorite_id=$1`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [favoriteId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const createFavorite = async (userId: number, logId: number) => {
    logging.info(NAMESPACE, 'Creating new favorite record');
    const QUERY = `INSERT INTO favorite_logs (user_id, log_id, time_logged) VALUES($1, $2, current_timestamp)`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [userId, logId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const createNewComment = async (userId: number, logId: number, message: string) => {
    logging.info(NAMESPACE, 'Creating new comment in db');
    // const processedMessage = processTextForSql(message);
    const QUERY = `INSERT INTO strain_log_comments (log_id, owner_id, comment_message, time_logged) VALUES($1, $2, $3, current_timestamp);`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [logId, userId, message]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const getStrainByDetails = async (name: string, strain: string, category: string) => {
    logging.info(NAMESPACE, 'Getting strain by details');
    const QUERY = `SELECT * FROM strains where name=$1 AND strain=$2 AND category=$3`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [name, strain, category]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const createNewStrain = async (newStrain: any) => {
    logging.info(NAMESPACE, 'Create new strain in db');
    const { name, strain, category } = newStrain;
    const QUERY = `INSERT INTO strains (name, category, strain) VALUES($1, $2, $3) RETURNING strain_id;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [name, category, strain]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const deleteStrainLog = async (logId: number) => {
    logging.info(NAMESPACE, 'Deleting strain log from db');

    try {
        const QUERY = `DELETE FROM strain_logs WHERE strain_log_id=$1;`
        const response: QueryResult = await (await pool).query(QUERY, [logId]);

        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const updateLogByStrainLogId = async (log: any) => {
    logging.info(NAMESPACE, 'Updating strain log by strain_log_id');
    const { picUrl, cannabinoid, strainId, rating, review, id, productId, brandId, locationId } = log;
    const percentage = log.percentage !== 'null' ? log.percentage : null;
    const mgs = log.mgs !== 'null' ? log.mgs : null;

    try {
        const QUERY = `UPDATE strain_logs SET pic_url=$1, cannabinoid=$2, percentage=$3, strain_id=$4, rating=$5, review=$6, mgs=$7, brand_id=$8, product_id=$9, purchase_location_id=$10 WHERE strain_log_id=$11;`
        const response: QueryResult = await (await pool).query(QUERY, [picUrl, cannabinoid, percentage, strainId, rating, review, mgs, brandId, productId, locationId, id]);

        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const getStrainLogByLogId = async (logId: number) => {
    logging.info(NAMESPACE, 'Getting strain log by log id');
    const QUERY = `SELECT * FROM strain_logs where strain_log_id=$1`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [logId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const getCommentByCommentId = async (commentId: number) => {
    logging.info(NAMESPACE, 'Getting comment by comment id');
    const QUERY = `SELECT * FROM strain_log_comments where strain_log_comment_id=$1`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [commentId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const createNewStrainLogPcnt = async (log: any) => {
    logging.info(NAMESPACE, 'Creating new strain log with percent');

    const { userId, strainId, rating, picUrl, cannabinoid, percentage, review, purchaseLocationId, brandId, productId } = log;

    const QUERY = `INSERT INTO strain_logs (time_logged, pic_url, user_id, cannabinoid, percentage, strain_id, rating, review, purchase_location_id, brand_id, product_id) values (current_timestamp, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING strain_log_id;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [picUrl, userId, cannabinoid, percentage, strainId, rating, review, purchaseLocationId, brandId, productId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const createNewStrainLogMgs = async (log: any) => {
    logging.info(NAMESPACE, 'Creating new strain log with mgs');

    const { userId, strainId, rating, picUrl, cannabinoid, mgs, review, purchaseLocationId, brandId, productId } = log;

    const QUERY = `INSERT INTO strain_logs (time_logged, pic_url, user_id, cannabinoid, mgs, strain_id, rating, review, purchase_location_id, brand_id, product_id) values (current_timestamp, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING strain_log_id;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [picUrl, userId, cannabinoid, mgs, strainId, rating, review, purchaseLocationId, brandId, productId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const createNewStrainLog = async (newLog: any) => {
    logging.info(NAMESPACE, 'Creating new strain log');

    const { userId, strainId, rating, picUrl, cannabinoid, review, purchaseLocationId, brandId, productId } = newLog;

    const QUERY = `INSERT INTO strain_logs (time_logged, pic_url, user_id, cannabinoid, strain_id, rating, review, purchase_location_id, brand_id, product_id) values (current_timestamp, $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING strain_log_id;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [picUrl, userId, cannabinoid, strainId, rating, review, purchaseLocationId, brandId, productId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

export default {
    createNewStrainLogPcnt,
    createNewStrainLogMgs,
    createNewStrainLog,
    getStrainLogByLogId,
    getStrainByDetails,
    createNewStrain,
    createNewComment,
    createFavorite,
    deleteFavorite,
    getFavoritesByDetails,
    createBookmark,
    deleteBookmark,
    getBookmarksByDetails,
    searchStrainByName,
    deleteStrainLog,
    updateLogByStrainLogId,
    getCommentByCommentId
};

import { QueryResult } from 'pg';
import logging from '../config/logging';
import pool from '../config/pgrepo';
import cursorUtils from '../utils/cursor-utils';

const NAMESPACE = 'log-feed-repo';

const getCommentsByLogId = async (logId: number) => {
    logging.info(NAMESPACE, 'Getting comments by log id');
    const QUERY = `SELECT * FROM strain_log_comments where log_id=$1`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [logId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const getUserByUserId = async (userId: number) => {
    logging.info(NAMESPACE, 'Getting user by userid');
    const QUERY = `SELECT * FROM users where user_id=$1`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const getFavoritesByUserId = async (userId: number) => {
    logging.info(NAMESPACE, 'Getting favorites by username');
    const QUERY = `SELECT log_id FROM favorite_logs where user_id=$1`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const getBookmarksByUserId = async (userId: number) => {
    logging.info(NAMESPACE, 'Getting bookmarks by username');
    const QUERY = `SELECT log_id FROM bookmark_logs where user_id=$1`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const getAllStrainLogs = async (cursor: string, limit: number = 10) => {
    logging.info(NAMESPACE, 'Getting all strain logs.');

    let decodedCursor, QUERY;
    try {
        decodedCursor = await cursorUtils.decodeCursor(cursor);
    } catch (e) {
        logging.error(NAMESPACE, "An error occurred when getting strain logs. Unable to parse cursor.")
    }

    if (decodedCursor) {
        QUERY = `SELECT * FROM detailed_strain_logs WHERE time_logged <= $1::TIMESTAMP AND strain_log_id < $2 ORDER BY time_logged DESC, strain_log_id DESC LIMIT $3;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [decodedCursor.time_logged, decodedCursor.strain_log_id, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    } else {
        QUERY = `SELECT * FROM detailed_strain_logs ORDER BY time_logged DESC, strain_log_id DESC LIMIT $1;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    }
};

const getLogsByStrainId = async (strains: number[], cursor: string, limit: number = 10) => {
    logging.info(NAMESPACE, 'Getting logs by strain id.');

    let decodedCursor, QUERY;
    try {
        decodedCursor = await cursorUtils.decodeCursor(cursor);
    } catch (e) {
        logging.error(NAMESPACE, "An error occurred when getting strain logs. Unable to parse cursor.")
    }

    if (decodedCursor) {
        QUERY = `SELECT * FROM detailed_strain_logs WHERE strain_id = ANY($1::int[]) AND time_logged <= $2::TIMESTAMP AND strain_log_id < $3 ORDER BY time_logged DESC, strain_log_id DESC LIMIT $4;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [strains, decodedCursor.time_logged, decodedCursor.strain_log_id, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    } else {
        QUERY = `SELECT * FROM detailed_strain_logs where strain_id = ANY($1::int[]) ORDER BY time_logged DESC, strain_log_id DESC LIMIT $2;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [strains, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    }
};

const getLogsByRating = async (cursor: string, limit: number) => {
    logging.info(NAMESPACE, 'Getting all strain logs sorted by rating.');

    let decodedCursor, QUERY;
    try {
        decodedCursor = await cursorUtils.decodeCursor(cursor) as any;
    } catch (e) {
        logging.error(NAMESPACE, "An error occurred when getting strain logs. Unable to parse cursor.")
    }

    if (decodedCursor) {
        QUERY = `SELECT * FROM detailed_strain_logs WHERE rating <= $1 AND time_logged < $2::TIMESTAMP ORDER BY rating DESC, time_logged DESC LIMIT $3;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [decodedCursor.rating, decodedCursor.time_logged, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    } else {
        QUERY = `SELECT * FROM detailed_strain_logs ORDER BY rating DESC, time_logged DESC LIMIT $1;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    }
};

const getLogsByCommentCount = async (cursor: string, limit: number) => {
    logging.info(NAMESPACE, 'Getting strain logs ordered by comment count');

    let decodedCursor, QUERY;
    try {
        decodedCursor = await cursorUtils.decodeCursor(cursor) as any;
    } catch (e) {
        logging.error(NAMESPACE, "An error occurred when getting strain logs. Unable to parse cursor.")
    }

    if (decodedCursor) {
        QUERY = `SELECT * FROM detailed_strain_logs WHERE comment_count <= $1 OR (comment_count = $1 AND strain_log_id < $2) ORDER BY comment_count DESC, strain_log_id DESC LIMIT $3;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [decodedCursor.comment_count, decodedCursor.strain_log_id, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    } else {
        QUERY = `SELECT * FROM detailed_strain_logs ORDER BY comment_count DESC, strain_log_id DESC LIMIT $1;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    }
};

const getLogsByFavoriteCount = async (cursor: string, limit: number) => {
    logging.info(NAMESPACE, 'Getting strain logs ordered by favorite count');

    let decodedCursor, QUERY;
    try {
        decodedCursor = await cursorUtils.decodeCursor(cursor) as any;
    } catch (e) {
        logging.error(NAMESPACE, "An error occurred when getting strain logs. Unable to parse cursor.")
    }

    if (decodedCursor) {
        QUERY = `SELECT * FROM detailed_strain_logs WHERE favorite_count <= $1 OR (favorite_count = $1 AND strain_log_id < $2) ORDER BY favorite_count DESC, strain_log_id DESC LIMIT $3;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [decodedCursor.favorite_count, decodedCursor.strain_log_id, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    } else {
        QUERY = `SELECT * FROM detailed_strain_logs ORDER BY favorite_count DESC, strain_log_id DESC LIMIT $1;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    }
};

const getStrainLogsByUserId = async (userId: number) => {
    logging.info(NAMESPACE, 'Getting strain log by user id');
    const QUERY = `SELECT * FROM detailed_strain_logs where user_id=$1 ORDER BY time_logged DESC;`;

    try {
        const response: QueryResult = await (await pool).query(QUERY, [userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const getStrainLogByLogId = async (logId: number) => {
    logging.info(NAMESPACE, 'Getting strain log by user id');
    const QUERY = `SELECT * FROM detailed_strain_logs where strain_log_id=$1`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [logId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const getStrainByName = async (name: string) => {
    logging.info(NAMESPACE, 'Searching strain by name');
    const searchStr = `%${name}%`;
    const QUERY = `SELECT * FROM strains WHERE name ILIKE $1;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [searchStr]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

export default {
    getAllStrainLogs,
    getStrainLogsByUserId,
    getStrainLogByLogId,
    getFavoritesByUserId,
    getBookmarksByUserId,
    getUserByUserId,
    getCommentsByLogId,
    getLogsByRating,
    getLogsByCommentCount,
    getLogsByFavoriteCount,
    getLogsByStrainId,
    getStrainByName
};

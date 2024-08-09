import { QueryResult } from "pg";
import logging from "../../config/logging";
import cursorUtils from "../../utils/cursor-utils";
import pool from '../../config/pgrepo';

const NAMESPACE = 'feedback-status-repo'

const getHelpRequestStatuses = async (cursor: any, limit: number = 10) => {
    logging.info(NAMESPACE, 'Getting help requests');
    let decodedCursor;
    try {
        decodedCursor = await cursorUtils.decodeCursor(cursor);
    } catch (e) {
        logging.error(NAMESPACE, "An error occurred when getting help request statuses. Unable to parse cursor.")
    }

    if (decodedCursor) {
        const QUERY = `SELECT * FROM help_request_status where help_request_status_id < $1 AND time_logged <= $2 ORDER BY help_request_status_id DESC, time_logged DESC LIMIT $3;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [decodedCursor.help_request_status_id, decodedCursor.time_logged, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    } else {
        const QUERY = `SELECT * FROM help_request_status ORDER BY help_request_status_id DESC, time_logged DESC LIMIT $1;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    }
}

const getHelpRequestStatusesByStatus = async (status: string, cursor: any, limit: number = 10) => {
    logging.info(NAMESPACE, 'Getting help requests by status');
    let decodedCursor;
    try {
        decodedCursor = await cursorUtils.decodeCursor(cursor);
    } catch (e) {
        logging.error(NAMESPACE, "An error occurred when getting help request statuses. Unable to parse cursor.")
    }

    if (decodedCursor) {
        const QUERY = `SELECT * FROM help_request_status where status=$1 AND help_request_status_id > $2 AND time_logged >= $3 ORDER BY help_request_status_id ASC, time_logged ASC LIMIT $4;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [status, decodedCursor.help_request_status_id, decodedCursor.time_logged, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    } else {
        const QUERY = `SELECT * FROM help_request_status where status=$1 ORDER BY help_request_status_id ASC, time_logged ASC LIMIT $2;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [status, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    }
}

const getUserFeedbackStatuses = async (cursor: any, limit: number = 10) => {
    logging.info(NAMESPACE, 'Getting user feedback statuses');
    let decodedCursor;
    try {
        decodedCursor = await cursorUtils.decodeCursor(cursor);
    } catch (e) {
        logging.error(NAMESPACE, "An error occurred when getting feedback statuses. Unable to parse cursor.")
    }

    if (decodedCursor) {
        const QUERY = `SELECT * FROM user_feedback_status where user_feedback_status_id < $1 AND time_logged <= $2 ORDER BY user_feedback_status_id DESC, time_logged DESC LIMIT $3;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [decodedCursor.user_feedback_status_id, decodedCursor.time_logged, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    } else {
        const QUERY = `SELECT * FROM user_feedback_status ORDER BY user_feedback_status_id DESC, time_logged DESC LIMIT $1;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    }
}

const getUserFeedbackStatusesByStatus = async (status: string, cursor: any, limit: number = 10) => {
    logging.info(NAMESPACE, 'Getting user feedback by status');
    let decodedCursor;
    try {
        decodedCursor = await cursorUtils.decodeCursor(cursor);
    } catch (e) {
        logging.error(NAMESPACE, "An error occurred when getting feedback statuses. Unable to parse cursor.")
    }

    if (decodedCursor) {
        const QUERY = `SELECT * FROM user_feedback_status where status=$1 AND user_feedback_status_id > $2 AND time_logged >= $3 ORDER BY user_feedback_status_id ASC, time_logged ASC LIMIT $4;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [status, decodedCursor.user_feedback_status_id, decodedCursor.time_logged, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    } else {
        const QUERY = `SELECT * FROM user_feedback_status where status=$1 ORDER BY user_feedback_status_id ASC, time_logged ASC LIMIT $2;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [status, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    }
}

const getFlaggedContentStatuses = async (cursor: any, limit: number = 10) => {
    logging.info(NAMESPACE, 'Getting flagged content');
    let decodedCursor;
    try {
        decodedCursor = await cursorUtils.decodeCursor(cursor);
    } catch (e) {
        logging.error(NAMESPACE, "An error occurred when getting flagged content statuses. Unable to parse cursor.")
    }

    if (decodedCursor) {
        const QUERY = `SELECT * FROM flagged_content_status where flagged_content_status_id < $1 AND time_logged <= $2 ORDER BY flagged_content_status_id DESC, time_logged DESC LIMIT $3;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [decodedCursor.flagged_content_status_id, decodedCursor.time_logged, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    } else {
        const QUERY = `SELECT * FROM flagged_content_status ORDER BY flagged_content_status_id DESC, time_logged DESC LIMIT $1;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    }
}

const getFlaggedContentStatusesByStatus = async (status: string, cursor: any, limit: number = 10) => {
    logging.info(NAMESPACE, 'Getting flagged content by status');
    let decodedCursor;
    try {
        decodedCursor = await cursorUtils.decodeCursor(cursor);
    } catch (e) {
        logging.error(NAMESPACE, "An error occurred when getting flagged content. Unable to parse cursor.")
    }

    if (decodedCursor) {
        const QUERY = `SELECT * FROM flagged_content_status where status=$1 AND flagged_content_status_id > $2 AND time_logged >= $3 ORDER BY flagged_content_status_id ASC, time_logged ASC LIMIT $4;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [status, decodedCursor.flagged_content_status_id, decodedCursor.time_logged, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    } else {
        const QUERY = `SELECT * FROM flagged_content_status where status=$1 ORDER BY flagged_content_status_id ASC, time_logged ASC LIMIT $2;`;
        try {
            const response: QueryResult = await (await pool).query(QUERY, [status, limit]);
            return response.rows;
        } catch (e: any) {
            logging.error(NAMESPACE, e.message, e);
            return { message: e.message, error: e };
        }
    }
}

const updateFlaggedContentStatus = async (id: number, category: string, action: string, notes: string, status: string): Promise<boolean> => {
    logging.info(NAMESPACE, 'Upadating flagged content status.')
    let result;

    const client = await (await pool).connect()
    try {
        await client.query('BEGIN')
        result = await client.query("UPDATE flagged_content_statuses SET category = $1, action_taken = $2, notes = $3, status=$4, time_closed = current_timestamp where flagged_content_status_id = $5;", [category, action, notes, status, id]);
        await client.query(`
        UPDATE flagged_content_statuses SET search_vector =
          to_tsvector('english', COALESCE(category::text, '') || ' ' ||
                                  COALESCE(status::text, '') || ' ' ||
                                  COALESCE(action_taken::text, '') || ' ' ||
                                  COALESCE(notes::text, '') || ' ' || 
                                  COALESCE(time_closed::text, '') || ' ' 
                                  );`)
        await client.query('COMMIT')
    } catch (e: any) {
        await client.query('ROLLBACK')
        logging.error(NAMESPACE, e.message, e);
        return false;
    } finally {
        client.release()
        return result?.rowCount === 1;

    }
}

const updateHelpRequestStatus = async (id: number, category: string, action: string, notes: string, status: string): Promise<boolean> => {
    logging.info(NAMESPACE, 'Upadating help request status.');
    let result;

    const client = await (await pool).connect()
    try {
        await client.query('BEGIN')
        result = await client.query("UPDATE help_request_statuses SET category = $1, action_taken = $2, notes = $3, status=$4, time_closed = current_timestamp where help_request_status_id = $5;", [category, action, notes, status, id]);
        await client.query(`
        UPDATE help_request_statuses SET search_vector =
          to_tsvector('english', COALESCE(category::text, '') || ' ' ||
                                COALESCE(status::text, '') || ' ' ||
                                COALESCE(action_taken::text, '') || ' ' ||
                                COALESCE(notes::text, '') || ' ' || 
                                COALESCE(time_closed::text, '') || ' ' 
                                );`)
        await client.query('COMMIT')
    } catch (e: any) {
        await client.query('ROLLBACK')
        logging.error(NAMESPACE, e.message, e);
        return false;
    } finally {
        client.release();
        return result?.rowCount === 1;
    }
}

const updateUserFeedbackStatus = async (id: number, category: string, action: string, notes: string, status: string): Promise<boolean> => {
    logging.info(NAMESPACE, 'Upadating user feedback status.');
    let result;

    const client = await (await pool).connect()
    try {
        await client.query('BEGIN')
        result = await client.query("UPDATE user_feedback_statuses SET category = $1, action_taken = $2, notes = $3, status=$4, time_closed = current_timestamp where user_feedback_status_id = $5;", [category, action, notes, status, id]);
        await client.query(`
        UPDATE user_feedback_statuses SET search_vector =
          to_tsvector('english', COALESCE(category::text, '') || ' ' ||
                                COALESCE(status::text, '') || ' ' ||
                                COALESCE(action_taken::text, '') || ' ' ||
                                COALESCE(notes::text, '') || ' ' || 
                                COALESCE(time_closed::text, '') || ' ' 
                                );`)
        await client.query('COMMIT')
    } catch (e: any) {
        await client.query('ROLLBACK')
        logging.error(NAMESPACE, e.message, e);
        return false;
    } finally {
        client.release();
        return result?.rowCount === 1;
    }
}

const searchHelpRequestStatus = async (searchTerm: string) => {
    const client = await (await pool).connect()
    try {
        const result = await client.query(`SELECT *,
        ts_rank(hrs.search_vector, to_tsquery('english', $1)) AS hrs_relevance,
        ts_rank(hr.search_vector, to_tsquery('english', $1)) AS hr_relevance
        FROM help_request_statuses hrs
        JOIN help_requests hr ON hrs.help_request_id=hr.help_request_id
        WHERE hrs.search_vector @@ to_tsquery('english', $1) OR hr.search_vector @@ to_tsquery('english', $1)
        ORDER BY hrs_relevance DESC, hr_relevance DESC;`, [searchTerm]);
        return result.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return false;
    } finally {
        client.release();
    }
}

const searchUserFeedbackStatus = async (searchTerm: string) => {
    const client = await (await pool).connect()
    try {
        const result = await client.query(`SELECT *,
        ts_rank(ufs.search_vector, to_tsquery('english', $1)) AS ufs_relevance,
        ts_rank(uf.search_vector, to_tsquery('english', $1)) AS uf_relevance
        FROM user_feedback_statuses ufs
        JOIN user_feedback uf ON ufs.user_feedback_id=uf.user_feedback_id
        WHERE ufs.search_vector @@ to_tsquery('english', $1) OR uf.search_vector @@ to_tsquery('english', $1)
        ORDER BY ufs_relevance DESC, uf_relevance DESC;`, [searchTerm]);
        return result.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return false;
    } finally {
        client.release();
    }
}

const searchFlaggedContentStatus = async (searchTerm: string) => {
    const client = await (await pool).connect()
    try {
        const result = await client.query(`SELECT *,
        ts_rank(fcs.search_vector, to_tsquery('english', $1)) AS fcs_relevance,
        ts_rank(fc.search_vector, to_tsquery('english', $1)) AS fc_relevance
        FROM flagged_content_statuses fcs
        JOIN flagged_content fc ON fcs.flagged_content_id=fc.flagged_content_id
        WHERE fcs.search_vector @@ to_tsquery('english', $1) OR fc.search_vector @@ to_tsquery('english', $1)
        ORDER BY fcs_relevance DESC, fc_relevance DESC;`, [searchTerm]);
        return result.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return false;
    } finally {
        client.release();
    }
}

export default {
    getHelpRequestStatuses,
    getHelpRequestStatusesByStatus,
    getUserFeedbackStatuses,
    getUserFeedbackStatusesByStatus,
    getFlaggedContentStatuses,
    getFlaggedContentStatusesByStatus,
    updateFlaggedContentStatus,
    updateHelpRequestStatus,
    updateUserFeedbackStatus,
    searchHelpRequestStatus,
    searchUserFeedbackStatus,
    searchFlaggedContentStatus
}
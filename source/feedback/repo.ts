import logging from '../config/logging';
import pool from '../config/pgrepo';

const NAMESPACE = 'user-feedback-repo';

const createHelpRequestRecord = async (helpRequest: any) => {
    logging.info(NAMESPACE, 'Creating new help request record');
    const client = await (await pool).connect()
    let result;
    try {
        await client.query('BEGIN')
        const userId = helpRequest.callingUser.userId;
        const message = helpRequest.message;
        const insertHelpRequestQuery = `INSERT INTO help_requests (user_id, message, time_logged) VALUES($1, $2, current_timestamp) RETURNING help_request_id;`;
        const insertHelpRequestStatusQuery = `INSERT INTO help_request_statuses (help_request_id, status) VALUES ($1, $2);`
        const updateHRSearchVector = `
        UPDATE help_requests SET search_vector =
          to_tsvector('english', COALESCE(user_id::text, '') || ' ' ||
                                COALESCE(message::text, '') || ' ' ||
                                COALESCE(time_logged::text, '') || ' '
                                );`;
        const updateStatusSearchvector = `
        UPDATE help_request_statuses SET search_vector =
          to_tsvector('english', COALESCE(category::text, '') || ' ' ||
                                COALESCE(status::text, '') || ' ' ||
                                COALESCE(action_taken::text, '') || ' ' ||
                                COALESCE(notes::text, '') || ' ' || 
                                COALESCE(time_closed::text, '') || ' ' 
                                );`;

        result = await client.query(insertHelpRequestQuery, [userId, message])
        await client.query(insertHelpRequestStatusQuery, [result.rows[0].help_request_id, 'unread'])
        await client.query(updateHRSearchVector)
        await client.query(updateStatusSearchvector)
        await client.query('COMMIT')

    } catch (e: any) {
        await client.query('ROLLBACK')
        logging.error(NAMESPACE, e.message, e);
    } finally {
        client.release();
        return result?.rows || [];
    }
};

const createFlaggedContentRecord = async (flaggedContent: any) => {
    logging.info(NAMESPACE, 'Creating new reported content record');
    const client = await (await pool).connect()
    let result;
    try {
        await client.query('BEGIN')
        const { contentId, contentType } = flaggedContent;
        const userId = flaggedContent.callingUser.userId;
        const insertFlaggedContentQuery = `INSERT INTO flagged_content (user_id, content_id, content_type, time_logged) VALUES($1, $2, $3, current_timestamp) RETURNING flagged_content_id;`;
        const insertFlaggedContentStatusQuery = `INSERT INTO flagged_content_statuses (flagged_content_id, status) VALUES ($1, $2);`
        const updateFCSearchVector = `
        UPDATE flagged_content SET search_vector =
         to_tsvector('english', COALESCE(user_id::text, '') || ' ' ||
                                COALESCE(content_type::text, '') || ' ' ||
                                COALESCE(content_id::text, '') || ' ' ||
                                COALESCE(time_logged::text, '') || ' '
                                );`;
        const updateStatusSearchvector = `
        UPDATE flagged_content_statuses SET search_vector =
          to_tsvector('english', COALESCE(category::text, '') || ' ' ||
                                COALESCE(status::text, '') || ' ' ||
                                COALESCE(action_taken::text, '') || ' ' ||
                                COALESCE(notes::text, '') || ' ' || 
                                COALESCE(time_closed::text, '') || ' ' 
                                );`;

        result = await client.query(insertFlaggedContentQuery, [userId, contentId, contentType])
        await client.query(insertFlaggedContentStatusQuery, [result.rows[0].flagged_content_id, 'unread'])
        await client.query(updateFCSearchVector)
        await client.query(updateStatusSearchvector)
        await client.query('COMMIT')
    } catch (e: any) {
        await client.query('ROLLBACK')
        logging.error(NAMESPACE, e.message, e);
    } finally {
        client.release();
        return result?.rows || [];
    }
};

const createFeedbackRecord = async (feedback: any) => {
    logging.info(NAMESPACE, 'Creating new feedback record');
    const client = await (await pool).connect()
    let result;
    try {
        await client.query('BEGIN')
        const userId = feedback.callingUser.userId;
        const message = feedback.message;
        const insertFeedbacksQuery = `INSERT INTO user_feedback (user_id, message, time_logged) VALUES($1, $2, current_timestamp) RETURNING user_feedback_id;`;
        const insertFeedbackStatusQuery = `INSERT INTO user_feedback_statuses (user_feedback_id, status) VALUES ($1, $2);`
        const updateUFSearchVector = `
        UPDATE user_feedback SET search_vector =
          to_tsvector('english', COALESCE(user_id::text, '') || ' ' ||
                                COALESCE(message::text, '') || ' ' ||
                                COALESCE(time_logged::text, '') || ' '
                                );`;
        const updateStatusSearchvector = `
        UPDATE user_feedback_statuses SET search_vector =
          to_tsvector('english', COALESCE(category::text, '') || ' ' ||
                                COALESCE(status::text, '') || ' ' ||
                                COALESCE(action_taken::text, '') || ' ' ||
                                COALESCE(notes::text, '') || ' ' || 
                                COALESCE(time_closed::text, '') || ' ' 
                                );`;

        result = await client.query(insertFeedbacksQuery, [userId, message])
        await client.query(insertFeedbackStatusQuery, [result.rows[0].user_feedback_id, 'unread'])
        await client.query(updateUFSearchVector)
        await client.query(updateStatusSearchvector)
        await client.query('COMMIT')
    } catch (e: any) {
        await client.query('ROLLBACK')
        logging.error(NAMESPACE, e.message, e);
    } finally {
        client.release();
        return result?.rows || [];
    }
};

export default { createFlaggedContentRecord, createHelpRequestRecord, createFeedbackRecord };

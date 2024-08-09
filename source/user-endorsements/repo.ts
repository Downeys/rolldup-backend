import { QueryResult } from 'pg';
import logging from '../config/logging';
import pool from '../config/pgrepo';

const NAMESPACE = 'user-endorsements-repo';

const endorseFirstLogin = async (userId: number) => {
    logging.info(NAMESPACE, 'Endorsing first login');
    const QUERY = `UPDATE user_endorsements SET first_login=false where user_id=$1`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const endorseAgeAndEula = async (userId: number) => {
    logging.info(NAMESPACE, 'Endorsing eula and age');
    const QUERY = `UPDATE user_endorsements SET eula=true, adult=true, first_login=false where user_id=$1`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const endorseEula = async (userId: number) => {
    logging.info(NAMESPACE, 'Endorsing eula');
    const QUERY = `UPDATE user_endorsements SET eula=true where user_id=$1`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const getEndorsementsByUserId = async (userId: number) => {
    logging.info(NAMESPACE, 'Getting endorsements by username');
    const QUERY = `SELECT * FROM user_endorsements where user_id=$1`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

export default { getEndorsementsByUserId, endorseEula, endorseAgeAndEula, endorseFirstLogin };

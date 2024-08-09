import { QueryResult } from 'pg';
import logging from '../config/logging';
import pool from '../config/pgrepo';
import { IUser } from '../interfaces';

const NAMESPACE = 'users-repo';

const createNewUser = async (username: string) => {
  logging.info(NAMESPACE, 'Adding new user to db');

  const client = await (await pool).connect()
  try {
    await client.query('BEGIN')
    const insertUserQuery = `INSERT INTO users (username, user_rank, join_date) values ($1, 'Greenhorn', CURRENT_DATE) RETURNING *;`
    const insertSettingsQuery = `INSERT INTO user_settings (user_id, pronouns, public_profile, dark_mode, pn_messages, pn_group_activities, pn_comments, pn_friend_requests, pn_recommendations, pn_newsletter)
      values ($1, 'None', TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE);`
    const insertEndorsementsQuery = `INSERT INTO user_endorsements (user_id, eula, adult, first_login) values ($1, false, false, true);`

    const userRes = await client.query(insertUserQuery, [username])
    await client.query(insertSettingsQuery, [userRes.rows[0].user_id])
    await client.query(insertEndorsementsQuery, [userRes.rows[0].user_id])
    await client.query('COMMIT')
    client.release()
    return userRes.rows;
  } catch (e: any) {
    await client.query('ROLLBACK')
    logging.error(NAMESPACE, e.message, e);
    client.release()
    return { message: e.message, error: e };
  }
};

const updateRank = async (userId: number, rank: string): Promise<boolean> => {
  logging.info(NAMESPACE, 'updating user rank', { userId, rank });

  const client = await (await pool).connect()
  try {
    const result = await client.query('UPDATE users SET user_rank = $1 where user_id = $2 and user_rank != $3;', [rank, userId, rank]);
    return result.rowCount === 1;
  } catch (e: any) {
    logging.error(NAMESPACE, e.message, e);
    return false;
  } finally {
    client.release();
  }
}

const getUserByUserId = async (userId: number) => {
  logging.info(NAMESPACE, 'Getting user by userId');
  const QUERY = `SELECT * FROM users where user_id=$1`;
  try {
    const response: QueryResult<IUser> = await (await pool).query(QUERY, [userId]);
    return response.rows;
  } catch (e: any) {
    logging.error(NAMESPACE, e.message, e);
    return { message: e.message, error: e };
  }
};

const getUserByUsername = async (username: string) => {
  logging.info(NAMESPACE, 'Getting user by username');
  const QUERY = `SELECT * FROM users where username=$1`;
  try {
    const response: QueryResult<IUser> = await (await pool).query(QUERY, [username]);
    return response.rows;
  } catch (e: any) {
    logging.error(NAMESPACE, e.message, e);
    return { message: e.message, error: e };
  }
};

export default { getUserByUsername, createNewUser, getUserByUserId, updateRank };

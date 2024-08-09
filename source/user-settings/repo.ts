import { QueryResult } from 'pg';
import logging from '../config/logging';
import pool from '../config/pgrepo';
import { IUser } from '../interfaces';

const NAMESPACE = 'user-settings-crud-controller';

const updateProfilePic = async (userId: number, imageUrl: string) => {
    logging.info(NAMESPACE, 'Updating profile pic');

    const QUERY = `update users set profile_pic=$1 where user_id=$2;`;
    try {
        const response: QueryResult<IUser> = await (await pool).query(QUERY, [imageUrl, userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const updatePushNotis = async (body: any) => {
    logging.info(NAMESPACE, 'Updating push notification settings');
    const { messages, groupActivities, comments, friendRequests, recommendations, newsletter } = body;
    const userId = body.callingUser.userId;

    const QUERY = `update user_settings set pn_messages=$1, pn_group_activities=$2, pn_comments=$3, pn_friend_requests=$4, pn_recommendations=$5, pn_newsletter=$6 where user_id=$7;`;
    try {
        const response: QueryResult<IUser> = await (await pool).query(QUERY, [messages, groupActivities, comments, friendRequests, recommendations, newsletter, userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const updateProfilePrivacy = async (userId: number, publicProfile: boolean) => {
    logging.info(NAMESPACE, 'Updating profile privacy');
    const QUERY = `update user_settings set public_profile=$1 where user_id=$2;`;
    try {
        const response: QueryResult<IUser> = await (await pool).query(QUERY, [publicProfile, userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const updateUserBirthdate = async (userId: number, birthdate: any) => {
    logging.info(NAMESPACE, 'Updating birthday');
    const QUERY = `update user_settings set birthdate=$1 where user_id=$2;`;
    try {
        const response: QueryResult<IUser> = await (await pool).query(QUERY, [birthdate, userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const updateUserPronouns = async (userId: number, pronouns: string) => {
    logging.info(NAMESPACE, 'Updating pronouns');
    const QUERY = `update user_settings set pronouns=$1 where user_id=$2;`;
    try {
        const response: QueryResult<IUser> = await (await pool).query(QUERY, [pronouns, userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

const updateUsername = async (userId: number, username: string) => {
    logging.info(NAMESPACE, 'Getting user settings by username');
    const QUERY = `update users set username=$1 where user_id=$2;`;
    try {
        const response: QueryResult<IUser> = await (await pool).query(QUERY, [username, userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};


const getSettingsByUserId = async (userId: number) => {
    logging.info(NAMESPACE, 'Getting user settings by username');
    const QUERY = `SELECT * FROM user_settings where user_id=$1`;
    try {
        const response: QueryResult<IUser> = await (await pool).query(QUERY, [userId]);
        return response.rows;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return { message: e.message, error: e };
    }
};

export default { getSettingsByUserId, updateUsername, updateUserPronouns, updateUserBirthdate, updateProfilePrivacy, updatePushNotis, updateProfilePic };

import { parse } from 'postgres-array';
import pool from '../config/pgrepo';
import logging from '../config/logging';
import { AdB2cUser, AppRole } from './service';
import { createUserInDb } from '../users/service';

const NAMESPACE = 'auth-repo';

const createOrGetUserFromClaims = async (tokenClaims: { [name: string]: string }): Promise<AdB2cUser> => {
    const client = await (await pool).connect();

    try {
        const sub = tokenClaims["sub"];

        const lookupQueryResult = await client.query(`
            select sub, adb2c_users.user_id as user_id, created_at, app_roles
            from adb2c_users
            left join users on
                adb2c_users.user_id = users.user_id
            where sub=$1;`, [sub]);

        if (lookupQueryResult.rowCount !== 0) {
            const record = lookupQueryResult.rows[0];
            return dbRecordToAdB2cUser(record);
        } else {
            try {
                await client.query('BEGIN');
                const userResult = await createUserInDb({ username: tokenClaims["name"] });
                const userId = (userResult as any[])[0]["user_id"];
                const insertQueryResult = await client.query(`
                    INSERT INTO adb2c_users(sub, user_id, created_at)
                    VALUES($1,$2,now()) RETURNING sub, user_id, created_at;
                `, [tokenClaims["sub"], userId]);
                await client.query('COMMIT;');
                const newRecord = insertQueryResult.rows[0];

                return dbRecordToAdB2cUser(newRecord);
            } catch (e: any) {
                await client.query('ROLLBACK;');
                logging.error(NAMESPACE, e.message, e);
                throw new Error(e);
            }
        }
    } finally {
        client.release();
    }
}

const dbRecordToAdB2cUser = (record: { [name: string]: any }) => ({
    sub: record["sub"],
    userId: record["user_id"],
    createdAt: record["created_at"],
    appRoles: record["app_roles"] ? parse(record["app_roles"]) as AppRole[] : [],
});

export default {
    createOrGetUserFromClaims,
};

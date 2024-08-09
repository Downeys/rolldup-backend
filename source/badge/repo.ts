import logging from '../config/logging';
import pool from '../config/pgrepo';

const NAMESPACE = 'user-badges-repo';

const createBadge = async (userId: number, label: string, level: string) => {
    logging.info(NAMESPACE, 'Creating badge', { userId, label, level });

    const client = await (await pool).connect()
    try {
        await client.query('begin');
        const result = await client.query('insert into user_badges(user_id, label, level) values ($1, $2, $3) on conflict do nothing;', [userId, label, level]);
        await client.query('commit');
        return result.rowCount === 1;
    } catch (e: any) {
        await client.query('rollback');
        logging.error(NAMESPACE, e.message, e);
        return false;
    } finally {
        client.release();
    }
};

const findBadgesByUserIdOrderByAwardedAtDesc = async (userId: number) => {
    const client = await (await pool).connect();
    try {
        const resultSet = await client.query(`
            select distinct on (label) 
                label, user_id, level, awarded_at, array_position(enum_range(level::badge_level), level) as position 
            from user_badges where user_id = $1 order by label, position desc;
        `, [userId]);
        return resultSet.rows;
    } finally {
        client.release();
    }
};

export default {
    createBadge,
    findBadgesByUserIdOrderByAwardedAtDesc,
};

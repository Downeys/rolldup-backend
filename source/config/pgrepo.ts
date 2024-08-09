import { Pool } from 'pg';
import { migrate } from 'postgres-migrations';
import config from './config';

async function constructPool() {
    const resolvedConfig = await config;

    const pool = new Pool({
        user: resolvedConfig.pg.username,
        host: resolvedConfig.pg.host,
        password: resolvedConfig.pg.password,
        database: resolvedConfig.pg.database,
        port: resolvedConfig.pg.port,
        ssl: resolvedConfig.pg.ssl
    });

    await migrate({ client: pool }, 'sql-scripts/migrations');

    return pool;
}

export default constructPool();

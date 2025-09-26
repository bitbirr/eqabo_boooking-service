import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import config from './env.js';
import * as schema from '../db/schema.js';

const pool = new Pool({
  connectionString: config.databaseUrl,
});

const db = drizzle(pool, { schema });

export const healthCheck = async () => {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    return true;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export { pool, db };
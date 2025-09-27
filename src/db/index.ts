import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg-pool";
import { ServerlessDriver } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

await pool.connect();

export const db = drizzle(pool, { schema });
import * as schema from "./schema.js";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();

export const db = drizzle(client, { schema });
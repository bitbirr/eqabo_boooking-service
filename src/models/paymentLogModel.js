import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to create a payment log
export const createPaymentLog = async (logData) => {
  const { booking_id, raw_payload } = logData;
  const res = await pool.query(
    'INSERT INTO payment_logs (booking_id, raw_payload) VALUES ($1, $2) RETURNING *',
    [booking_id, raw_payload]
  );
  return res.rows[0];
};
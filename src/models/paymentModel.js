import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to create a payment record
export const createPayment = async (paymentData) => {
  const { booking_id, provider, provider_ref, amount } = paymentData;
  const res = await pool.query(
    'INSERT INTO payments (booking_id, provider, provider_ref, amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [booking_id, provider, provider_ref, amount, 'pending']
  );
  return res.rows[0];
};

// Function to update payment status
export const updatePaymentStatus = async (id, status) => {
  const res = await pool.query(
    'UPDATE payments SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return res.rows[0];
};
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to create a booking
export const createBooking = async (bookingData) => {
  const { user_id, hotel_id, room_id, checkin_date, checkout_date, total_amount } = bookingData;
  const res = await pool.query(
    'INSERT INTO bookings (user_id, hotel_id, room_id, checkin_date, checkout_date, status, total_amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [user_id, hotel_id, room_id, checkin_date, checkout_date, 'pending_payment', total_amount]
  );
  return res.rows[0];
};

// Function to get booking details
export const getBookingDetails = async (id) => {
  const res = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
  return res.rows[0];
};
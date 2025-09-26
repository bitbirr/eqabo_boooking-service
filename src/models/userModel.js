import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to create a user
export const createUser = async (userData) => {
  const { name, email, phone, password_hash } = userData;
  const res = await pool.query(
    'INSERT INTO users (name, email, phone, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, email, phone, password_hash, 'user']
  );
  return res.rows[0];
};

// Function to find a user by email
export const findUserByEmail = async (email) => {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};
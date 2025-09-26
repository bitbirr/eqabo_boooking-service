import { db, pool } from '../config/db.js';
import { bookings } from './schema.js';
import { and, eq, inArray, lt, gt } from 'drizzle-orm';

export const checkAvailability = async (roomId, checkin, checkout) => {
  const client = await pool.connect();
  try {
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [roomId]);

    const conflictingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.roomId, roomId),
          inArray(bookings.status, ['pending_payment', 'confirmed']),
          lt(bookings.checkinDate, checkout),
          gt(bookings.checkoutDate, checkin)
        )
      );

    return conflictingBookings.length === 0;
  } finally {
    client.release();
  }
};
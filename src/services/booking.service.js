import { db } from '../config/db.js';
import { bookings, rooms } from '../db/schema.js';
import { eq, and, lt } from 'drizzle-orm';
import { sql } from 'drizzle-orm/sql';

export const createBooking = async ({
  hotelId,
  roomId,
  checkinDate,
  checkoutDate,
  userName,
  userPhone,
}) => {
  const checkin = new Date(checkinDate);
  const checkout = new Date(checkoutDate);
  const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));

  return await db.transaction(async (tx) => {
    // 🔒 Lock based on room ID (prevents double booking)
    await tx.execute(sql`SELECT pg_advisory_xact_lock(${roomId})`);

    // ✅ Ensure room is still available
    const roomResult = await tx
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);
    if (roomResult.length === 0) throw new Error('Room not found');

    const room = roomResult[0];
    if (room.status !== 'available') {
      throw new Error('Room is not available.');
    }

    const totalAmount = nights * parseFloat(room.price);

    // ⏳ Create pending booking
    const result = await tx
      .insert(bookings)
      .values({
        hotelId,
        roomId,
        checkinDate: checkin,
        checkoutDate: checkout,
        userName,
        userPhone,
        totalAmount,
        status: 'pending_payment',
      })
      .returning();

    // 🚫 Mark room as reserved until payment confirmed
    await tx
      .update(rooms)
      .set({ status: 'reserved' })
      .where(eq(rooms.id, roomId));

    return result[0];
  });
};

export const getBookingById = async (id) => {
  const result = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);
  return result[0] || null;
};

export const expirePending = async () => {
  // Expire bookings older than 30 minutes
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  await db
    .update(bookings)
    .set({ status: 'cancelled' })
    .where(
      and(
        eq(bookings.status, 'pending_payment'),
        lt(bookings.createdAt, thirtyMinutesAgo)
      )
    );
};
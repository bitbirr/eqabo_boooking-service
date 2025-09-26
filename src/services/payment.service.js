import { db } from '../config/db.js';
import { payments, bookings, rooms } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const createPayment = async ({ bookingId, provider }) => {
  // Get booking amount
  const bookingResult = await db
    .select({ totalAmount: bookings.totalAmount })
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);
  if (bookingResult.length === 0) throw new Error('Booking not found');

  const amount = bookingResult[0].totalAmount;

  const result = await db
    .insert(payments)
    .values({ bookingId, provider, amount, status: 'pending' })
    .returning();
  return result[0];
};

export const markPaymentSuccess = async (paymentId) => {
  return await db.transaction(async (tx) => {
    // Update payment status
    await tx
      .update(payments)
      .set({ status: 'success' })
      .where(eq(payments.id, paymentId));

    // Get bookingId and update booking status
    const paymentResult = await tx
      .select({ bookingId: payments.bookingId })
      .from(payments)
      .where(eq(payments.id, paymentId))
      .limit(1);
    if (paymentResult.length > 0) {
      await tx
        .update(bookings)
        .set({ status: 'confirmed' })
        .where(eq(bookings.id, paymentResult[0].bookingId));
      // Room stays reserved ✅
    }
  });
};

export const markPaymentFailed = async (paymentId) => {
  return await db.transaction(async (tx) => {
    // Update payment status
    await tx
      .update(payments)
      .set({ status: 'failed' })
      .where(eq(payments.id, paymentId));

    // Get bookingId and update booking status
    const paymentResult = await tx
      .select({ bookingId: payments.bookingId })
      .from(payments)
      .where(eq(payments.id, paymentId))
      .limit(1);
    if (paymentResult.length > 0) {
      const bookingId = paymentResult[0].bookingId;
      await tx
        .update(bookings)
        .set({ status: 'cancelled' })
        .where(eq(bookings.id, bookingId));

      // Get roomId from booking and free the room
      const bookingResult = await tx
        .select({ roomId: bookings.roomId })
        .from(bookings)
        .where(eq(bookings.id, bookingId))
        .limit(1);
      if (bookingResult.length > 0) {
        await tx
          .update(rooms)
          .set({ status: 'available' })
          .where(eq(rooms.id, bookingResult[0].roomId));
      }
    }
  });
};
import { db } from '../config/db.js';
import { hotels, rooms, cities, bookings } from '../db/schema.js';
import { eq, and, or, lt, gt } from 'drizzle-orm';

export const listCities = async () => {
  return await db.select().from(cities);
};

export const listHotels = async (city) => {
  if (city) {
    return await db.select().from(hotels).where(eq(hotels.city, city));
  }
  return await db.select().from(hotels);
};

export const getHotelById = async (id) => {
  const result = await db
    .select()
    .from(hotels)
    .where(eq(hotels.id, id))
    .limit(1);
  return result[0] || null;
};

export const listRoomsByHotelWithAvailability = async (hotelId, checkinDate, checkoutDate) => {
  const checkin = new Date(checkinDate);
  const checkout = new Date(checkoutDate);

  // Get all rooms for the hotel
  const allRooms = await db
    .select()
    .from(rooms)
    .where(eq(rooms.hotelId, hotelId));

  // Get conflicting bookings
  const conflictingBookings = await db
    .select({ roomId: bookings.roomId })
    .from(bookings)
    .where(
      and(
        eq(bookings.hotelId, hotelId),
        or(
          and(lt(bookings.checkinDate, checkout), gt(bookings.checkoutDate, checkin)),
          and(eq(bookings.checkinDate, checkin), eq(bookings.checkoutDate, checkout))
        ),
        or(eq(bookings.status, 'confirmed'), eq(bookings.status, 'pending_payment'))
      )
    );

  const bookedRoomIds = new Set(conflictingBookings.map(b => b.roomId));

  return allRooms.map(room => ({
    id: room.id,
    roomNumber: room.roomNumber,
    type: room.type,
    price: room.price,
    status: bookedRoomIds.has(room.id) ? 'reserved' : room.status,
  }));
};
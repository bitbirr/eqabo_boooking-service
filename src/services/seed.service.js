import { db } from '../config/db.js';
import { cities, hotels, rooms, users, bookings } from '../db/schema.js';

export const seedDemoData = async () => {
  // Insert cities
  const cityInserts = await db
    .insert(cities)
    .values([
      { name: 'Addis Ababa' },
      { name: 'Lalibela' },
    ])
    .returning();

  // Insert users
  const userInserts = await db
    .insert(users)
    .values([
      {
        name: 'John Doe',
        email: 'john@example.com',
      },
    ])
    .returning();

  // Insert hotels
  const hotelInserts = await db
    .insert(hotels)
    .values([
      {
        name: 'Sheraton Addis',
        cityId: cityInserts.find(c => c.name === 'Addis Ababa').id,
        address: '123 Main St',
      },
      {
        name: 'Hyatt Addis',
        cityId: cityInserts.find(c => c.name === 'Addis Ababa').id,
        address: '456 Elm St',
      },
      {
        name: 'Mountain View Lalibela',
        cityId: cityInserts.find(c => c.name === 'Lalibela').id,
        address: '789 Hill Rd',
      },
      {
        name: 'Historic Lalibela Inn',
        cityId: cityInserts.find(c => c.name === 'Lalibela').id,
        address: '101 Rock St',
      },
    ])
    .returning();

  // Insert rooms for each hotel (3 rooms per hotel)
  const roomData = [
    { roomNumber: '101', type: 'Deluxe Room', price: 8000, maxGuests: 2 },
    { roomNumber: '102', type: 'Standard Room', price: 4000, maxGuests: 2 },
    { roomNumber: '103', type: 'Suite', price: 12000, maxGuests: 4 },
  ];

  for (const hotel of hotelInserts) {
    const roomInserts = roomData.map((data) => ({
      hotelId: hotel.id,
      roomNumber: data.roomNumber,
      type: data.type,
      price: data.price.toString(),
      maxGuests: data.maxGuests,
    }));
    await db.insert(rooms).values(roomInserts);
  }

  // Insert some bookings to make some rooms reserved
  const roomsInserts = await db.select().from(rooms);
  // For example, reserve one room in each hotel
  const reservedRooms = roomsInserts.filter((_, index) => index % 3 === 2); // Every third room

  for (const room of reservedRooms) {
    await db.insert(bookings).values({
      userId: userInserts[0].id,
      userName: 'John Doe',
      userPhone: '1234567890',
      hotelId: room.hotelId,
      roomId: room.id,
      checkinDate: new Date('2025-10-01'),
      checkoutDate: new Date('2025-10-03'),
      status: 'confirmed',
      totalAmount: (parseFloat(room.price) * 2).toString(), // 2 nights
    });
  }

  console.log('Demo data seeded successfully');
};
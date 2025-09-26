import { db } from '../config/db.js';
import { hotels, rooms, users, bookings } from '../db/schema.js';
import bcrypt from 'bcrypt';

export const seedDemoData = async () => {
  // Insert users
  await db.insert(users).values([
    {
      name: 'guest',
      email: 'guest@example.com',
      phone: '1234567890',
      passwordHash: await bcrypt.hash('password', 10),
      role: 'user',
    },
  ]);

  // Insert hotels
  const hotelInserts = await db
    .insert(hotels)
    .values([
      {
        name: 'Sheraton Addis',
        city: 'Addis Ababa',
        address: '123 Main St',
        description: 'A luxurious hotel in Addis Ababa.',
      },
      {
        name: 'Hyatt Addis',
        city: 'Addis Ababa',
        address: '456 Elm St',
        description: 'Comfortable hotel in Addis Ababa.',
      },
      {
        name: 'Mountain View Lalibela',
        city: 'Lalibela',
        address: '789 Hill Rd',
        description: 'Scenic hotel in Lalibela.',
      },
      {
        name: 'Historic Lalibela Inn',
        city: 'Lalibela',
        address: '101 Rock St',
        description: 'Historic inn in Lalibela.',
      },
    ])
    .returning();

  // Insert rooms for each hotel (3 rooms per hotel)
  const roomData = [
    { type: 'Deluxe Room', price: 8000 },
    { type: 'Standard Room', price: 4000 },
    { type: 'Suite', price: 12000 },
  ];

  for (const hotel of hotelInserts) {
    const roomInserts = roomData.map((data, index) => ({
      hotelId: hotel.id,
      roomNumber: `${index + 1}01`,
      type: data.type,
      price: data.price,
      maxGuests: 2,
    }));
    await db.insert(rooms).values(roomInserts);
  }

  // Insert some bookings to make some rooms reserved
  const roomsInserts = await db.select().from(rooms);
  // For example, reserve one room in each hotel
  const reservedRooms = roomsInserts.filter((_, index) => index % 3 === 2); // Every third room

  for (const room of reservedRooms) {
    await db.insert(bookings).values({
      userName: 'guest',
      userPhone: '1234567890',
      hotelId: room.hotelId,
      roomId: room.id,
      checkinDate: new Date('2025-10-01'),
      checkoutDate: new Date('2025-10-03'),
      status: 'confirmed',
      totalAmount: room.price * 2, // 2 nights
    });
  }

  console.log('Demo data seeded successfully');
};
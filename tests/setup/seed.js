import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../../src/db/schema.js";

export async function seedDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const db = drizzle(client, { schema });

  // Clear existing data
  await db.delete(schema.payments);
  await db.delete(schema.bookings);
  await db.delete(schema.rooms);
  await db.delete(schema.hotels);
  await db.delete(schema.cities);
  await db.delete(schema.users);

  // Insert cities
  const cityInserts = await db.insert(schema.cities).values([
    { name: "Addis Ababa" },
    { name: "Lalibela" },
  ]).returning();

  const addis = cityInserts.find(c => c.name === "Addis Ababa");
  const lalibela = cityInserts.find(c => c.name === "Lalibela");

  // Insert hotels
  const hotelInserts = await db.insert(schema.hotels).values([
    { cityId: addis.id, name: "Sheraton Addis", address: "123 Main St" },
    { cityId: addis.id, name: "Hyatt Addis", address: "456 Elm St" },
    { cityId: lalibela.id, name: "Mountain View Lalibela", address: "789 Hill Rd" },
  ]).returning();

  // Insert rooms
  const roomInserts = await db.insert(schema.rooms).values([
    { hotelId: hotelInserts[0].id, roomNumber: "101", type: "Deluxe Room", price: "8000", maxGuests: 2, status: "available" },
    { hotelId: hotelInserts[0].id, roomNumber: "102", type: "Standard Room", price: "4000", maxGuests: 2, status: "available" },
    { hotelId: hotelInserts[1].id, roomNumber: "101", type: "Suite", price: "12000", maxGuests: 4, status: "reserved" },
  ]).returning();

  // Insert test user
  const userInserts = await db.insert(schema.users).values({
    email: "guest@example.com",
    name: "Test Guest",
  }).returning();

  // Insert a booking for the reserved room
  const reservedRoom = roomInserts.find(r => r.status === "reserved");
  await db.insert(schema.bookings).values({
    userId: userInserts[0].id,
    userName: "Test Guest",
    userPhone: "1234567890",
    hotelId: reservedRoom.hotelId,
    roomId: reservedRoom.id,
    checkinDate: new Date('2025-10-01'),
    checkoutDate: new Date('2025-10-03'),
    status: "confirmed",
    totalAmount: "24000", // 12000 * 2
  });

  await client.end();
}
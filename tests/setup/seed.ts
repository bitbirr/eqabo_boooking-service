import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../../src/db/schema";

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
  const [addis, lalibela] = await db.insert(schema.cities).values([
    { id: 1, name: "Addis Ababa" },
    { id: 2, name: "Lalibela" },
  ]).returning();

  // Insert hotels
  const [sheraton, hyatt, mountainView] = await db.insert(schema.hotels).values([
    { id: 1, cityId: addis.id, name: "Sheraton Addis", description: "Luxury hotel" },
    { id: 2, cityId: addis.id, name: "Hyatt Addis", description: "Comfortable hotel" },
    { id: 3, cityId: lalibela.id, name: "Mountain View Lalibela", description: "Scenic hotel" },
  ]).returning();

  // Insert rooms
  await db.insert(schema.rooms).values([
    { id: 1, hotelId: sheraton.id, name: "Deluxe Room", price: "8000", status: "available" },
    { id: 2, hotelId: sheraton.id, name: "Standard Room", price: "4000", status: "available" },
    { id: 3, hotelId: hyatt.id, name: "Suite", price: "12000", status: "reserved" },
  ]);

  // Insert test user
  await db.insert(schema.users).values({
    id: 1,
    email: "guest@example.com",
    name: "Test Guest",
  });

  await client.end();
}
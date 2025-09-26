import { db } from "./db";
import { cities, hotels, rooms } from "./schema";

await db.insert(cities).values([
  { name: "Addis Ababa" },
  { name: "Mekelle" }
]);

await db.insert(hotels).values([
  { name: "Hilton Addis", city: "Addis Ababa", address: "Bole Road" },
  { name: "Axum Hotel", city: "Mekelle", address: "Main Street" }
]);

await db.insert(rooms).values([
  { hotelId: 1, roomNumber: "101", type: "Deluxe", price: 120, maxGuests: 2 },
  { hotelId: 1, roomNumber: "102", type: "Standard", price: 80, maxGuests: 2 },
  { hotelId: 2, roomNumber: "201", type: "Suite", price: 200, maxGuests: 3 }
]);
import { pgTable, serial, text, integer, timestamp, pgEnum, uuid, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ----------------- ENUMS -----------------
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending_payment",
  "confirmed",
  "cancelled"
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "success",
  "failed"
]);

export const userRoleEnum = pgEnum("user_role", [
  "user",
  "admin"
]);

// ----------------- CITIES -----------------
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// ----------------- HOTELS -----------------
export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id").references(() => cities.id).notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// ----------------- ROOMS -----------------
export const roomStatusEnum = pgEnum("room_status", [
  "available",
  "reserved"
]);

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").references(() => hotels.id).notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  status: roomStatusEnum("status").default("available").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({
  unqRoom: uniqueIndex("unq_room_per_hotel").on(table.hotelId, table.name)
}));

// ----------------- BOOKINGS -----------------
export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  hotelId: integer("hotel_id").references(() => hotels.id).notNull(),
  roomId: integer("room_id").references(() => rooms.id).notNull(),
  checkinDate: timestamp("checkin_date").notNull(),
  checkoutDate: timestamp("checkout_date").notNull(),
  status: bookingStatusEnum("status").default("pending_payment").notNull(),
  totalAmount: integer("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// ----------------- PAYMENTS -----------------
export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id").references(() => bookings.id).notNull(),
  provider: text("provider").notNull(), // "telebirr", "chappa", "ebirr", "kaafi"
  amount: integer("amount").notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  referenceId: text("reference_id"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// ----------------- USERS -----------------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// ----------------- RELATIONS -----------------
export const citiesRelations = relations(cities, ({ many }) => ({
  hotels: many(hotels)
}));

export const hotelsRelations = relations(hotels, ({ one, many }) => ({
  city: one(cities, { fields: [hotels.cityId], references: [cities.id] }),
  rooms: many(rooms)
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  hotel: one(hotels, { fields: [rooms.hotelId], references: [hotels.id] }),
  bookings: many(bookings)
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
  hotel: one(hotels, { fields: [bookings.hotelId], references: [hotels.id] }),
  room: one(rooms, { fields: [bookings.roomId], references: [rooms.id] }),
  payments: many(payments)
}));
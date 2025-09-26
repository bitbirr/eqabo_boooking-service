import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  uuid,
  numeric,
  varchar,
} from "drizzle-orm/pg-core";

// 🔹 ENUMS
export const roomStatusEnum = pgEnum("room_status", ["available", "reserved"]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending_payment",
  "confirmed",
  "cancelled",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "success",
  "failed",
]);

// 🔹 CITIES
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// 🔹 HOTELS
export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
});

// 🔹 ROOMS
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id")
    .references(() => hotels.id, { onDelete: "cascade" })
    .notNull(),
  roomNumber: text("room_number").notNull(),
  type: text("type").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  maxGuests: integer("max_guests").notNull(),
  status: roomStatusEnum("status").default("available").notNull(),
});

// 🔹 BOOKINGS
export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  hotelId: integer("hotel_id")
    .references(() => hotels.id, { onDelete: "cascade" })
    .notNull(),
  roomId: integer("room_id")
    .references(() => rooms.id, { onDelete: "cascade" })
    .notNull(),
  checkinDate: timestamp("checkin_date").notNull(),
  checkoutDate: timestamp("checkout_date").notNull(),
  userName: text("user_name").notNull(),
  userPhone: text("user_phone").notNull(),
  status: bookingStatusEnum("status").default("pending_payment").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 🔹 PAYMENTS
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .references(() => bookings.id, { onDelete: "cascade" })
    .notNull(),
  provider: text("provider").notNull(), // e.g., "ebirr"
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  reference: varchar("reference", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
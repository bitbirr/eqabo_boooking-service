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
  index,
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

// 🔹 USERS
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
}));

// 🔹 CITIES
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
}, (table) => ({
  nameIdx: index("cities_name_idx").on(table.name),
}));

// 🔹 HOTELS
export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id")
    .references(() => cities.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
}, (table) => ({
  cityIdIdx: index("hotels_city_id_idx").on(table.cityId),
  nameIdx: index("hotels_name_idx").on(table.name),
}));

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
}, (table) => ({
  hotelIdIdx: index("rooms_hotel_id_idx").on(table.hotelId),
  statusIdx: index("rooms_status_idx").on(table.status),
}));

// 🔹 BOOKINGS
export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
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
}, (table) => ({
  userIdIdx: index("bookings_user_id_idx").on(table.userId),
  hotelIdIdx: index("bookings_hotel_id_idx").on(table.hotelId),
  roomIdIdx: index("bookings_room_id_idx").on(table.roomId),
  checkinDateIdx: index("bookings_checkin_date_idx").on(table.checkinDate),
  checkoutDateIdx: index("bookings_checkout_date_idx").on(table.checkoutDate),
  statusIdx: index("bookings_status_idx").on(table.status),
}));

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
}, (table) => ({
  bookingIdIdx: index("payments_booking_id_idx").on(table.bookingId),
  statusIdx: index("payments_status_idx").on(table.status),
}));
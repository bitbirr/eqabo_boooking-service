import request from "supertest";
import app from "../src/app.js"; // Express app
import { seedDatabase } from "./setup/seed.js";

beforeAll(async () => {
  await seedDatabase();
});

describe("Hotel Booking E2E Flow", () => {
  let bookingId;
  let paymentId;

  test("Should list cities", async () => {
    const res = await request(app).get("/api/cities");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Should list hotels in Addis Ababa", async () => {
    const res = await request(app).get("/api/hotels?city_id=1");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toBe("Sheraton Addis");
  });

  test("Should show available rooms for Sheraton Addis", async () => {
    const res = await request(app).get("/api/rooms?hotel_id=1&checkin=2025-10-01&checkout=2025-10-03");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].status).toBe("available");
  });

  test("Should create pending booking", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send({
        hotelId: 1,
        roomId: 1,
        checkinDate: "2025-10-01",
        checkoutDate: "2025-10-03",
        userName: "Test Guest",
        userPhone: "1234567890",
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("pending_payment");
    bookingId = res.body.bookingId;
  });

  test("Should initiate payment", async () => {
    const res = await request(app)
      .post("/api/payments/initiate")
      .send({
        bookingId,
        provider: "ebirr",
        amount: 16000, // 8000 * 2
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("pending");
    paymentId = res.body.id;
  });

  test("Should confirm payment callback success", async () => {
    const res = await request(app)
      .post("/api/payments/callback")
      .send({
        bookingId,
        provider: "ebirr",
        status: "success",
        reference: "TX123456",
      });

    expect(res.status).toBe(200);
    expect(res.body.bookingStatus).toBe("confirmed");
  });

  test("Should generate booking receipt", async () => {
    const res = await request(app).get(`/api/receipts/${bookingId}`);
    expect(res.status).toBe(200);
    expect(res.header["content-type"]).toBe("application/pdf");
  });

  test("Should fail if payment amount mismatch", async () => {
    const res = await request(app)
      .post("/api/payments/callback")
      .send({
        bookingId,
        provider: "ebirr",
        status: "success",
        reference: "TX_DUPLICATE",
        amount: 9999, // wrong amount
      });

    expect(res.status).toBe(400);
  });
});
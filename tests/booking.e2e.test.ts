import request from "supertest";
import app from "../src/app"; // Express app
import { seedDatabase } from "./setup/seed";

beforeAll(async () => {
  await seedDatabase();
});

describe("Hotel Booking E2E Flow", () => {
  let bookingId: number;
  let paymentId: number;

  test("Should list cities", async () => {
    const res = await request(app).get("/api/cities");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("name");
  });

  test("Should list hotels in Addis Ababa", async () => {
    const res = await request(app).get("/api/hotels?cityId=1");
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe("Sheraton Addis");
  });

  test("Should show available rooms for Sheraton Addis", async () => {
    const res = await request(app).get("/api/rooms?hotelId=1&checkIn=2025-10-01&checkOut=2025-10-03");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].status).toBe("available");
  });

  test("Should create pending booking", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send({
        userId: 1,
        hotelId: 1,
        roomId: 1,
        checkIn: "2025-10-01",
        checkOut: "2025-10-03",
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("pending_payment");
    bookingId = res.body.id;
  });

  test("Should initiate payment", async () => {
    const res = await request(app)
      .post("/api/payments/initiate")
      .send({
        bookingId,
        provider: "telebirr",
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("pending");
    paymentId = res.body.id;
  });

  test("Should confirm payment callback success", async () => {
    const res = await request(app)
      .post("/api/payments/callback")
      .send({
        bookingId,
        provider: "telebirr",
        status: "success",
        reference: "TX123456",
      });

    expect(res.status).toBe(200);
    expect(res.body.bookingStatus).toBe("confirmed");
  });

  test("Should generate booking receipt", async () => {
    const res = await request(app).get(`/api/bookings/${bookingId}/receipt`);
    expect(res.status).toBe(200);
    expect(res.header["content-type"]).toBe("application/pdf");
  });

  test("Should fail if payment amount mismatch", async () => {
    const res = await request(app)
      .post("/api/payments/callback")
      .send({
        bookingId,
        provider: "telebirr",
        status: "success",
        reference: "TX_DUPLICATE",
        amount: 9999, // wrong amount
      });

    expect(res.status).toBe(400);
  });
});
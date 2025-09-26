# Initial Project Plan: Node.js 20+ Express Application with Neon Postgres

## Overview
Create a Node.js 20+ project using Express 5.x, Neon Postgres, and ES Modules with the following specifications:
- Production dependencies: express@5.x, pg, swagger-ui-express, cors, helmet, dotenv, compression, pino, winston, nodemailer, openai
- Dev dependencies: nodemon, eslint, prettier
- Scripts: start, dev, lint, format
- .env file with DATABASE_URL for Neon connection
- Organized project structure following Node.js best practices

## Todo List
- [ ] Verify Node.js 20+ is installed and available
- [ ] Initialize npm project with package.json (enable ES modules)
- [ ] Install production dependencies: express@5.x, pg, swagger-ui-express, cors, helmet, dotenv, compression, pino, winston, nodemailer, openai
- [ ] Install dev dependencies: nodemon, eslint, prettier
- [ ] Configure package.json scripts: start, dev, lint, format
- [ ] Create .env file with DATABASE_URL placeholder for Neon connection string
- [ ] Set up basic project directory structure (src/, config/, routes/, middleware/, utils/)
- [ ] Create basic Express server file (src/server.js) with ES module imports
- [ ] Configure ESLint and Prettier with appropriate rules
- [ ] Create README.md with project setup and usage instructions

2. Project Structure
/src
  /config         # db, swagger, logger, etc
  /routes         # route definitions
  /controllers    # request handlers
  /services       # business logic
  /models         # SQL queries
  /middlewares    # auth, error handler
  /docs           # swagger specs
  app.js
  server.js

3. Database (Neon PostgreSQL)

Prompt for Copilot

# Create schema for hotel booking system
- hotels (id, name, location, description, status, created_at)
- rooms (id, hotel_id, room_type, price_per_night, capacity, status)
- bookings (id, user_id, hotel_id, room_id, checkin_date, checkout_date, status, total_amount, created_at)
- payments (id, booking_id, provider, provider_ref, amount, status, created_at)
- users (id, name, email, phone, password_hash, role, created_at)
- payment_logs (id, booking_id, raw_payload JSONB, created_at)
- Add indexes for performance (hotel_id, room_id, status).
- Use UUID as primary key default gen_random_uuid().

4. REST API Routes

Prompt for Copilot

# Create Express 5.x routes with swagger docs
- /api/hotels [GET] → list hotels
- /api/hotels/:id/rooms [GET] → list available rooms
- /api/bookings [POST] → create booking (pending_payment)
- /api/bookings/:id [GET] → booking details
- /api/payments/initiate [POST] → start payment (provider, amount)
- /api/payments/callback [POST] → provider callback
- /api/users/register [POST] → user registration
- /api/users/login [POST] → JWT login

5. Middlewares

Prompt for Copilot

# Add Express middlewares
- helmet for security headers
- cors with whitelist domains
- express.json with 10mb limit
- compression for responses
- errorHandler: global error catcher with JSON output
- rateLimiter: limit to 100 req/min per IP
- logger: pino + winston-daily-rotate-file

6. Booking & Payment Logic

Prompt for Copilot

# Implement booking workflow
- On booking POST:
  * Validate dates, availability.
  * Create booking with status = pending_payment.
- On payment initiate:
  * Insert payment record (status=pending).
  * Call dummy provider API (simulate push payment).
- On payment callback:
  * Verify signature/ref.
  * If success → update payments.success + bookings.confirmed.
  * If fail → mark payments.failed + bookings.cancelled.
- Auto-expire pending bookings after 15 minutes (cron job).

7. Swagger API Docs

Prompt for Copilot

# Add Swagger documentation
- Use swagger-ui-express.
- Auto-generate OpenAPI 3.0 spec from routes.
- Each endpoint must have: tags, summary, requestBody, responses (200, 400, 500).
- Add /api/docs route serving Swagger UI.

8. Testing

Prompt for Copilot

# Write integration tests with Jest + Supertest
- Hotels: GET /api/hotels returns list
- Rooms: GET /api/hotels/:id/rooms filters availability
- Bookings: POST /api/bookings creates pending booking
- Payments: POST /api/payments/initiate stores payment
- Payments Callback: POST /api/payments/callback updates booking to confirmed
- Users: POST /api/users/register/login works with JWT
- Edge case: expired booking auto cancels if no payment

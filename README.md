# Hotel Booking API

## Overview
This project is a hotel booking API built with Node.js, Express, and PostgreSQL. It provides endpoints for managing hotels, bookings, users, and payments.

## Project Structure
```
/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── docs/
│   ├── app.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

## Installation
1. Clone the repository.
2. Navigate to the project directory.
3. Run `npm install` to install dependencies.

## Environment Variables
Create a `.env` file in the root directory with the following content:
```
DATABASE_URL=your_neon_database_connection_string_here
PORT=3000
```

## Running the Application
- To start the server, run:
  ```bash
  npm run dev
  ```

## API Documentation
- Access the API documentation at `/api/docs`.

## Testing
- Run tests using:
  ```bash
  npm test
  ```

## License
This project is licensed under the MIT License.
import { seedDemoData } from '../src/services/seed.service.js';
import { db } from '../src/config/db.js';

describe('Seed Data', () => {
  beforeAll(async () => {
    // Clear existing data if needed
    await db.delete(require('../src/db/schema.js').bookings);
    await db.delete(require('../src/db/schema.js').payments);
    await db.delete(require('../src/db/schema.js').rooms);
    await db.delete(require('../src/db/schema.js').hotels);
    await db.delete(require('../src/db/schema.js').users);

    // Seed the data
    await seedDemoData();
  });

  it('should seed users', async () => {
    const users = await db.select().from(require('../src/db/schema.js').users);
    expect(users.length).toBe(1);
    expect(users[0].name).toBe('guest');
  });

  it('should seed hotels', async () => {
    const hotels = await db.select().from(require('../src/db/schema.js').hotels);
    expect(hotels.length).toBe(4); // 2 per city
    const cities = [...new Set(hotels.map(h => h.city))];
    expect(cities).toEqual(['Addis Ababa', 'Lalibela']);
  });

  it('should seed rooms', async () => {
    const rooms = await db.select().from(require('../src/db/schema.js').rooms);
    expect(rooms.length).toBe(12); // 3 per hotel * 4 hotels
  });

  it('should seed some bookings for reserved rooms', async () => {
    const bookings = await db.select().from(require('../src/db/schema.js').bookings);
    expect(bookings.length).toBe(4); // One per hotel
  });
});
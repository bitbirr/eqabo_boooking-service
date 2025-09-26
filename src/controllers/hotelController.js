import { listCities, listHotels, listRoomsByHotelWithAvailability } from '../services/hotel.service.js';

// Get all cities
export const getCities = async (req, res) => {
  try {
    const cities = await listCities();
    res.status(200).json(cities.map(c => c.name));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cities', error });
  }
};

// Get hotels, optionally filtered by city
export const getHotels = async (req, res) => {
  try {
    const { city } = req.query;
    const hotels = await listHotels(city);
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hotels', error });
  }
};

// Get rooms for a hotel with availability
export const getHotelRooms = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { checkin, checkout } = req.query;
    if (!checkin || !checkout) {
      return res.status(400).json({ message: 'checkin and checkout dates are required' });
    }
    const rooms = await listRoomsByHotelWithAvailability(hotelId, checkin, checkout);
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error });
  }
};
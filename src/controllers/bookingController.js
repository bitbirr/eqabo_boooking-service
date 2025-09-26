import { createBooking, getBookingById } from '../services/booking.service.js';

// Create a new booking
export const createNewBooking = async (req, res) => {
  try {
    const { hotelId, roomId, checkinDate, checkoutDate, userName, userPhone } = req.body;
    const booking = await createBooking({
      hotelId,
      roomId,
      checkinDate,
      checkoutDate,
      userName,
      userPhone,
    });
    res.status(201).json({
      bookingId: booking.id,
      status: booking.status,
      totalAmount: booking.totalAmount,
    });
  } catch (error) {
    if (error.message === 'Room is not available.') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating booking', error });
  }
};

// Get booking details
export const fetchBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking details', error });
  }
};

// Get booking receipt
export const getBookingReceipt = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // For now, return JSON. In production, generate PDF
    res.status(200).json({
      booking,
      // payment details would be fetched here
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating receipt', error });
  }
};
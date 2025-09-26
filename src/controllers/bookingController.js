import { createBooking, getBookingById } from '../services/booking.service.js';
import PDFDocument from 'pdfkit';

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
    const { booking_id } = req.params;
    const booking = await getBookingById(booking_id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Generate PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${booking.id}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('Booking Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Booking ID: ${booking.id}`);
    doc.text(`Hotel ID: ${booking.hotelId}`);
    doc.text(`Room ID: ${booking.roomId}`);
    doc.text(`Check-in: ${booking.checkinDate}`);
    doc.text(`Check-out: ${booking.checkoutDate}`);
    doc.text(`User Name: ${booking.userName}`);
    doc.text(`User Phone: ${booking.userPhone}`);
    doc.text(`Status: ${booking.status}`);
    doc.text(`Total Amount: ${booking.totalAmount}`);
    doc.text(`Created At: ${booking.createdAt}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Error generating receipt', error });
  }
};
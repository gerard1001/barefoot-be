/* eslint-disable no-else-return */
/* eslint-disable curly */
import bookingService from '../services/booking.service';
import roomService from '../services/rooms.service';
import { User } from '../database/models';

export const validateBookingId = async (req, res, next) => {
  const { bookingId, roomId } = req.params;
  const booking = await bookingService.listSingleBooking(bookingId, roomId);
  if (!booking) return res.status(404).json({ message: 'booking not found' });
  req.booking = booking;
  next();
};

export const checkRequester = async (req, res, next) => {
  const { roomId } = req.params;
  const { id } = req.user;

  const user = await User.findOne({
    where: { id },
    include: 'Role'
  });
  if (user.Role.name === 'REQUESTER') {
    const booking = await bookingService.checkBookingByUserId(id, roomId);
    if (!booking)
      return res.status(404).json({
        message: `no booking records found under your name`
      });

    return res.status(200).json({
      message: `booking information`,
      booking
    });
  }
  return next();
};
export const checkRegisterdUserId = async (req, res, next) => {
  const { id } = req.user;
  const { roomId, bookingId } = req.params;

  const user = await User.findOne({
    where: { id },
    include: 'Role'
  });

  const findBooking = await bookingService.listSingleBooking(bookingId, roomId);
  /* istanbul ignore next */
  if (findBooking.user_id !== id && user.Role.name !== 'SUPER_ADMIN')
    return res
      .status(400)
      .json({ message: 'you are not allowed to delete this booking' });
  return next();
};

export const checkStatus = async (req, res, next) => {
  const { booking } = req;
  const { name } = req.user.Role;
  if (booking.status !== 'PENDING' && name !== 'SUPER_ADMIN')
    return res.status(400).json({
      message: 'you are not allowed to modify an approved or rejected booking '
    });
  return next();
};

export const requesterUpdateBooking = async (req, res, next) => {
  const { roomId } = req.params;
  const { id } = req.user;

  const user = await User.findOne({
    where: { id },
    include: 'Role'
  });
  if (user.Role.name === 'REQUESTER') {
    const booking = await bookingService.checkBookingByUserId(id, roomId);
    /* istanbul ignore next */
    if (!booking) {
      return res.status(404).json({
        message: `no booking records found under your name`
      });
    }
  }
  next();
};

export const checkRoomAvailability = async (req, res, next) => {
  const { roomId } = req.params;
  const room = await roomService.findARoom(roomId);
  if (room.isBooked)
    return res.status(404).json({
      message:
        'Sorry, this room has been booked already. Please try another one.'
    });
  next();
};

export const checkBookingTripAdmin = async (req, res, next) => {
  const { id } = req.user;
  const { user_id } = req.room;
  const role = req.user.dataValues.Role.name;
  if (id !== user_id && role !== 'SUPER_ADMIN' && id !== req.booking.user_id) {
    return res
      .status(403)
      .json({ message: 'you are not allowed to modify this booking' });
  }
  return next();
};

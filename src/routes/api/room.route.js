import express from 'express';
import roomController from '../../controllers/room.controller';
import bookingController from '../../controllers/booking.controller';
import upload from '../../helpers/multer';
import { checkLoggedInUser, roles } from '../../middlewares/role.middleware';
import { validateAccommodationId } from '../../middlewares/accommodationId.middleware';
import { validateRoomId } from '../../middlewares/roomId.middleware';
import {
  checkBookingTripAdmin,
  checkRegisterdUserId,
  checkRequester,
  checkRoomAvailability,
  checkStatus,
  requesterUpdateBooking,
  validateBookingId
} from '../../middlewares/booking.middleware';
import roomValidation from '../../validations/room.validation';
import bookingValidation from '../../validations/booking.validation';
import { imageUpload } from '../../middlewares/imageUpload.middleware';

const room = express.Router();

room.post(
  '/accommodations/:accommodationId/rooms',
  checkLoggedInUser,
  roles('TRAVEL_ADMIN', 'SUPER_ADMIN'),
  validateAccommodationId,
  imageUpload,
  roomValidation,
  upload.array('images'),
  roomController.createRoom
);

room.get(
  '/accommodations/:accommodationId/rooms',
  validateAccommodationId,
  roomController.findAllRooms
);

room.get(
  '/accommodations/:accommodationId/rooms/:roomId',
  validateAccommodationId,
  validateRoomId,
  roomController.findRoom
);

// Room booking
room.post(
  '/rooms/:roomId/booking',
  checkLoggedInUser,
  roles('REQUESTER'),
  validateRoomId,
  bookingValidation,
  checkRoomAvailability,
  bookingController.createBooking
);

// Get bookings of a room
room.get(
  '/rooms/:roomId/booking',
  checkLoggedInUser,
  roles('REQUESTER', 'TRAVEL_ADMIN', 'SUPER_ADMIN'),
  validateRoomId,
  checkRequester,
  bookingController.listAllRoomBookings
);
room.get(
  '/rooms/booking',
  checkLoggedInUser,
  roles('REQUESTER', 'SUPER_ADMIN'),
  bookingController.listAllBookings
);

// Get single booking
room.get(
  '/rooms/:roomId/booking/:bookingId',
  checkLoggedInUser,
  roles('TRAVEL_ADMIN', 'SUPER_ADMIN'),
  validateRoomId,
  validateBookingId,
  bookingController.listSingleBooking
);

// Update booking status
room.patch(
  '/rooms/:roomId/booking/:bookingId',
  checkLoggedInUser,
  validateRoomId,
  validateBookingId,
  checkStatus,
  bookingValidation,
  requesterUpdateBooking,
  checkBookingTripAdmin,
  bookingController.updateBooking
);

// Delete booking
room.delete(
  '/rooms/:roomId/booking/:bookingId',
  checkLoggedInUser,
  roles('REQUESTER', 'SUPER_ADMIN'),
  validateRoomId,
  validateBookingId,
  checkRegisterdUserId,
  checkStatus,
  bookingController.deleteBooking
);

room.put(
  '/accommodations/:accommodationId/rooms/:roomId',
  checkLoggedInUser,
  roles('TRAVEL_ADMIN', 'SUPER_ADMIN'),
  validateAccommodationId,
  validateRoomId,
  imageUpload,
  roomValidation,
  upload.array('images'),
  roomController.updateRoom
);

room.delete(
  '/accommodations/:accommodationId/rooms/:roomId',
  checkLoggedInUser,
  roles('TRAVEL_ADMIN', 'SUPER_ADMIN'),
  validateAccommodationId,
  validateRoomId,
  roomController.destroyRoom
);

export default room;

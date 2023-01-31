/* eslint-disable import/no-named-as-default-member */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
/* eslint-disable curly */
/* eslint-disable require-jsdoc */
import bookingService from '../services/booking.service';
import eventEmitter from '../services/event.service';
import roomService from '../services/rooms.service';
import UserService from '../services/user.service';
import Notification from '../services/notification.service';

class bookingController {
  static async createBooking(req, res) {
    try {
      const { roomId } = req.params;
      const data = {
        ...req.body,
        user_id: req.user.id,
        room_id: roomId
      };
      const booking = await bookingService.createBooking(data);
      const room = await roomService.findARoom(roomId);
      const travel_admin = await new UserService().getUserId(
        room.Accommodations.user_id
      );
      const notify = await Notification.createNotification({
        details: `Requester ${req.user.first_name} ${req.user.last_name} has made a booking reservation at your accommodation`,
        type: 'booking',
        from_user_id: req.user.id,
        to_user_id: travel_admin.id
      });
      /* istanbul ignore next */
      if (travel_admin.email_notification == true) {
        const title = 'Booking reservation';
        const description =
          'has created a booking reservation at your accommodation.';
        const url = {
          baseUrl: process.env.BASE_URL,
          route: process.env.BOOKING_URL
        };
        eventEmitter.emit('bookingEmailNotification', {
          user: req.user,
          travel_admin,
          title,
          description,
          booking,
          url
        });
      }
      /* istanbul ignore next */
      if (travel_admin.in_app_notification == true) {
        eventEmitter.emit('appNotification', {
          recipient: travel_admin,
          notify
        });
      }

      return res
        .status(200)
        .json({ message: 'successfully booked a room.', booking });
    } catch (error) {
      /* istanbul ignore next */
      return res.status(500).json({ error: 'something went wrong!' });
    }
  }

  static async listAllRoomBookings(req, res) {
    try {
      const { roomId } = req.params;
      const bookings = await bookingService.listAllRoomBookings({
        where: { room_id: roomId }
      });
      /* istanbul ignore next */
      if (!bookings || bookings.count === 0) {
        return res
          .status(404)
          .json({ message: 'no booking records found on this room' });
      }
      return res
        .status(200)
        .json({ message: 'list of all bookings', bookings });
    } catch (error) {
      /* istanbul ignore next */
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  static async listAllBookings(req, res) {
    const { user } = req;
    const bookings = await bookingService.listAllBookings({
      where: { user_id: user.id }
    });
    /* istanbul ignore next */
    if (!bookings || bookings.count === 0)
      return res
        .status(404)
        .json({ message: 'you do not have any booking please book a room!' });

    return res
      .status(200)
      .json({ message: 'list of all your bookings', bookings });
  }

  static async listSingleBooking(req, res) {
    try {
      const { booking } = req;
      return res.status(200).json({ message: 'booking information', booking });
    } catch (error) {
      /* istanbul ignore next */
      res.status(500).json({ error: 'something went wrong' });
    }
  }

  static async updateBooking(req, res) {
    try {
      const { roomId, bookingId } = req.params;

      const updates = {
        ...req.body,
        room_id: roomId
      };

      const updatedBooking = await bookingService.updateBookingStatus(
        { where: { id: bookingId, room_id: roomId } },
        updates
      );
      if (updatedBooking[1][0].status === 'APPROVED') {
        await roomService.findAndUpdateRoom(
          { where: { id: roomId } },
          { isBooked: true }
        );
      }
      const user = await new UserService().getUserId(
        updatedBooking[1][0].user_id
      );
      const room = await roomService.findARoom(roomId);
      const travel_admin = await new UserService().getUserId(
        room.Accommodations.user_id
      );
      if (!req.body.status) {
        const notify = await Notification.createNotification({
          details: `Requester ${user.first_name} ${user.last_name} has updated their booking reservation`,
          type: 'booking',
          from_user_id: user.id,
          to_user_id: travel_admin.id
        });
        /* istanbul ignore next */
        if (travel_admin.email_notification == true) {
          const title = 'Booking updated';
          const description = 'has updated their booking reservation.';
          const url = {
            baseUrl: process.env.BASE_URL,
            route: process.env.BOOKING_URL
          };
          eventEmitter.emit('bookingEmailNotification', {
            user,
            travel_admin,
            title,
            description,
            booking: updatedBooking[1][0],
            url
          });
        }
        /* istanbul ignore next */
        if (travel_admin.in_app_notification == true) {
          eventEmitter.emit('appNotification', {
            recipient: travel_admin,
            notify
          });
        }
        return res
          .status(200)
          .json({ message: 'updated booking info', updatedBooking });
      }
      const notify = await Notification.createNotification({
        details: `Travel admin ${travel_admin.first_name} ${travel_admin.last_name} has ${updatedBooking[1][0].status} your booking reservation`,
        type: 'booking',
        from_user_id: travel_admin.id,
        to_user_id: user.id
      });
      /* istanbul ignore next */
      if (user.email_notification == true) {
        const title = 'Booking status updated';
        const description = `Thank you for your interest in booking a room reservation at our accommodation, your booking reservation has been ${updatedBooking[1][0].status}.`;
        const url = {
          baseUrl: process.env.BASE_URL,
          route: process.env.BOOKING_URL
        };
        eventEmitter.emit('bookingStatusNotification', {
          user,
          travel_admin,
          title,
          description,
          booking: updatedBooking[1][0],
          url
        });
      }
      /* istanbul ignore next */
      if (user.in_app_notification == true) {
        eventEmitter.emit('appNotification', { recipient: user, notify });
      }
      return res
        .status(200)
        .json({ message: 'updated booking info', updatedBooking });
    } catch (error) {
      /* istanbul ignore next */
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  static async deleteBooking(req, res) {
    try {
      const { bookingId, roomId } = req.params;
      await bookingService.deleteBooking({
        where: { id: bookingId, room_id: roomId }
      });
      const room = await roomService.findARoom(roomId);
      const travel_admin = await new UserService().getUserId(
        room.Accommodations.user_id
      );
      const notify = await Notification.createNotification({
        details: `Requester ${req.user.first_name} ${req.user.last_name} has deleted their booking reservation`,
        type: 'booking',
        from_user_id: req.user.id,
        to_user_id: travel_admin.id
      });
      /* istanbul ignore next */
      if (travel_admin.in_app_notification == true) {
        eventEmitter.emit('appNotification', {
          recipient: travel_admin,
          notify
        });
      }
      return res.status(201).json({ message: 'booking deleted successfully' });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ message: 'something went wrong' });
    }
  }
}
export default bookingController;

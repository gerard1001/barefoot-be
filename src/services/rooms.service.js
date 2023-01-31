/* eslint-disable require-jsdoc */
import { Room, Booking, Accommodation } from '../database/models';

class roomService {
  static async createRoom(room) {
    const roomCreate = await Room.create(room);
    return roomCreate;
  }

  static async findRooms({ where, offset, order, limit }) {
    const rooms = await Room.findAndCountAll({
      where,
      offset,
      limit,
      order: order || [['createdAt', 'DESC']],
      include: [
        {
          model: Booking,
          as: 'Bookings',
          attributes: [
            'id',
            'user_id',
            'status',
            'checkinDate',
            'checkoutDate',
            'room_id'
          ]
        },
        {
          model: Accommodation,
          as: 'Accommodations',
          attributes: ['id', 'name', 'user_id']
        }
      ]
    });
    return rooms;
  }

  static async findARoom(id) {
    const findRoom = await Room.findByPk(id, {
      include: [
        {
          model: Booking,
          as: 'Bookings',
          attributes: [
            'id',
            'user_id',
            'status',
            'checkinDate',
            'checkoutDate',
            'room_id'
          ]
        },
        {
          model: Accommodation,
          as: 'Accommodations',
          attributes: ['id', 'name', 'user_id']
        }
      ]
    });
    return findRoom;
  }

  static async findAndUpdateRoom({ where, id }, roomUpdate) {
    /* istanbul ignore next */
    const updateRoom = await Room.update(roomUpdate, {
      where: id ? { id } : where,
      returning: true,
      raw: true
    });
    return updateRoom;
  }

  static async deleteRoom({ where }) {
    const deleteRoom = await Room.destroy({ where });
    return deleteRoom;
  }
}

export default roomService;

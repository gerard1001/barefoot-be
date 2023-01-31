/* eslint-disable curly */
/* eslint-disable no-restricted-syntax */
/* eslint-disable require-jsdoc */
import roomService from '../services/rooms.service';
import { getPagination, getPaginatedData } from '../utils/pagination.utils';

class roomController {
  static async createRoom(req, res) {
    try {
      const accommodationId = req.accommodation.dataValues.id;
      const data = {
        ...req.rooms.value,
        accommodation_id: accommodationId,
        user_id: req.user.id
      };

      const room = await roomService.createRoom(data);
      return res
        .status(200)
        .json({ message: 'successfully created a room', room });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  static async findAllRooms(req, res) {
    try {
      const { offset, newLimit } = getPagination(
        req.query.page,
        req.query.limit
      );
      const accommodationExists = req.accommodation.dataValues;
      const accommodationId = accommodationExists.id;
      const foundRooms = await roomService.findRooms({
        where: { accommodation_id: accommodationId },
        offset,
        limit: newLimit
      });
      const response = getPaginatedData(foundRooms, req.query.page, newLimit);
      return res
        .status(200)
        .json({ message: 'list of all found rooms', response });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ message: 'internal server error', err });
    }
  }

  static async findRoom(req, res) {
    try {
      const foundRoom = req.room.dataValues;
      return res.status(200).json({ message: 'Room found', foundRoom });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  static async updateRoom(req, res) {
    try {
      const accommodationExists = req.accommodation.dataValues;
      const accommodationId = accommodationExists.id;
      const foundRoom = req.room.dataValues;
      const roomId = foundRoom.id;
      const roomUpdate = {
        ...req.rooms.value
      };
      await roomService.findAndUpdateRoom(
        { where: { id: roomId } },
        roomUpdate
      );

      const findUpdatedRoom = await roomService.findARoom(
        roomId,
        accommodationId
      );
      return res
        .status(200)
        .json({ message: 'Room has been updated', findUpdatedRoom });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  static async destroyRoom(req, res) {
    try {
      const foundRoom = req.room.dataValues;
      const roomId = foundRoom.id;
      const destroyRoom = await roomService.deleteRoom({
        where: { id: roomId }
      });
      return res.status(200).json({ message: 'Room deleted', destroyRoom });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ message: 'internal server error' });
    }
  }
}

export default roomController;

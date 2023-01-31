/* eslint-disable import/prefer-default-export */
import roomService from '../services/rooms.service';

export const validateRoomId = async (req, res, next) => {
  const { roomId } = req.params;
  const room = await roomService.findARoom(roomId);
  if (!room) return res.status(404).json({ message: 'Room does not exist' });
  req.room = room;
  next();
};

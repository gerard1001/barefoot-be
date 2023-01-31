/* eslint-disable require-jsdoc */

const { Model } = require('sequelize');
const { bookingStatus } = require('../../utils/booking.utils');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate({ User, Room }) {
      this.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      this.belongsTo(Room, { foreignKey: 'room_id', as: 'Rooms' });
    }
  }

  Booking.init(
    {
      checkinDate: DataTypes.DATE,
      checkoutDate: DataTypes.DATE,
      status: {
        type: DataTypes.ENUM,
        values: bookingStatus,
        defaultValue: 'PENDING'
      }
    },
    {
      sequelize,
      modelName: 'Booking',
      tableName: 'Bookings'
    }
  );

  return Booking;
};

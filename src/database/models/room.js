/* eslint-disable no-unused-vars */
/* eslint-disable valid-jsdoc */

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  // eslint-disable-next-line require-jsdoc
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.belongsTo(models.Accommodation, {
        foreignKey: 'accommodation_id',
        as: 'Accommodations'
      });
      Room.hasOne(models.Booking, {
        foreignKey: 'room_id',
        as: 'Bookings',
        onDelete: 'cascade'
      });
    }
  }
  Room.init(
    {
      price: DataTypes.STRING,
      images: DataTypes.ARRAY(DataTypes.STRING),
      imagesId: DataTypes.ARRAY(DataTypes.STRING),
      details: DataTypes.STRING,
      isBooked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      accommodation_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Room',
      tableName: 'Rooms'
    }
  );
  return Room;
};

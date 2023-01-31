/* eslint-disable camelcase */
/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */

const { Model } = require('sequelize');
const { tripStatus } = require('../../utils/trip.util');

module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      User,
      Location,
      Accommodation,
      tripComments,
      arrivalLocation
    }) {
      // define association here
      this.hasMany(tripComments, {
        foreignKey: 'trip_id',
        as: 'Comments'
      });
      this.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      this.belongsTo(User, {
        foreignKey: 'manager_id',
        as: 'manager'
      });
      this.belongsTo(Location, {
        foreignKey: 'depart_location_id',
        as: 'depart_location'
      });
      this.belongsTo(Accommodation, {
        foreignKey: 'accommodation_id'
      });
      this.hasMany(arrivalLocation, { foreignKey: 'TripId' });
    }
  }
  Trip.init(
    {
      tripDate: DataTypes.DATE,
      returnDate: DataTypes.DATE,
      reason: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM,
        values: tripStatus,
        defaultValue: 'PENDING'
      }
    },
    {
      sequelize,
      modelName: 'Trip'
    }
  );

  return Trip;
};

/* eslint-disable require-jsdoc */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class tripComments extends Model {
    static associate({ Trip, User }) {
      this.belongsTo(Trip, {
        foreignKey: 'trip_id',
        as: 'Trips'
      });
      this.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  tripComments.init(
    {
      comment: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'tripComments'
    }
  );
  return tripComments;
};

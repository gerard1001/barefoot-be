/* eslint-disable no-unused-vars */
/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class arrivalLocation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Trip, { foreignKey: 'TripId' });
      this.belongsTo(models.Accommodation,{foreignKey:"accommodation_id",as:"Accommodation"})

    }
  }
  arrivalLocation.init(
    {
      accommodation_id: DataTypes.INTEGER,
      days: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'arrivalLocation',
      tableName: 'arrivalLocations'
    }
  );
  return arrivalLocation;
};

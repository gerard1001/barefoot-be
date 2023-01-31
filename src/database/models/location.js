/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
      Location.hasMany(models.Accommodation, {
        foreignKey: 'location_id',
        as: 'Accommodations'
      });
      this.hasMany(models.Trip, {
        foreignKey: 'depart_location_id',
        as: 'depart_location'
      });
      this.hasMany(models.User, {
        foreignKey: 'location_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Location.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      country: DataTypes.STRING,
      longitude: DataTypes.FLOAT,
      latitude: DataTypes.FLOAT,
      visitCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: 'Location',
      tableName: 'Locations'
    }
  );
  return Location;
};

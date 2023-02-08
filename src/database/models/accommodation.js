/* eslint-disable func-names */
/* eslint-disable object-shorthand */
/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */

const { Model } = require('sequelize');
const { setArray, getArray } = require('../../utils/database.utils');

module.exports = (sequelize, DataTypes) => {
  class Accommodation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
      Accommodation.belongsTo(models.Location, {
        foreignKey: 'location_id',
        as: 'Locations'
      });
      Accommodation.hasMany(models.Room, {
        foreignKey: 'accommodation_id',
        as: 'Rooms',
        onDelete: 'CASCADE'
      });
      this.hasMany(models.Trip, {
        foreignKey: 'accommodation_id',
        onDelete: 'CASCADE'
      });
      this.hasMany(models.Like, { foreignKey: 'accommodation_id' });
      this.hasMany(models.AccommodationComment, {
        foreignKey: 'accommodation_id'
      });
      this.hasMany(models.arrivalLocation, { foreignKey: 'accommodation_id' });
    }
  }
  Accommodation.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      images: {
        type: DataTypes.STRING,
        get() {
          const rawValue = this.getDataValue('images');
          return rawValue ? JSON.parse(rawValue) : JSON.parse('[]');
        },
        set(value) {
          this.setDataValue('images', JSON.parse(value));
        }
        // get: getArray('images'),
        // set: setArray('images')
      },
      imagesId: {
        type: DataTypes.TEXT,
        get() {
          const rawValue = this.getDataValue('imagesId');
          return rawValue ? JSON.parse(rawValue) : JSON.parse('[]');
        },
        set(value) {
          this.setDataValue('imagesId', JSON.parse(value));
        }
        // get: getArray('imagesId'),
        // set: setArray('imagesId')
      },
      location_id: DataTypes.INTEGER,
      services: {
        type: DataTypes.TEXT,
        get() {
          const rawValue = this.getDataValue('services');
          return rawValue ? JSON.parse(rawValue) : JSON.parse('[]');
        },
        set(value) {
          this.setDataValue('services', JSON.parse(value));
        }
        // get: getArray('services'),
        // set: setArray('services')
      },
      amenities: {
        type: DataTypes.TEXT,
        get() {
          const rawValue = this.getDataValue('amenities');
          return rawValue ? JSON.parse(rawValue) : JSON.parse('[]');
        },
        set(value) {
          this.setDataValue('amenities', JSON.parse(value));
        }
        // get: getArray('amenities'),
        // set: setArray('amenities')
      },
      user_id: DataTypes.INTEGER,
      rates: {
        type: DataTypes.TEXT,
        get() {
          const rawValue = this.getDataValue('rates');
          return rawValue ? JSON.parse(rawValue) : JSON.parse('[]');
        },
        set(value) {
          this.setDataValue('rates', JSON.parse(value));
        }
        // get: getArray('rates'),
        // set: setArray('rates')
      }
    },
    {
      sequelize,
      modelName: 'Accommodation',
      tableName: 'Accommodations'
    }
  );
  return Accommodation;
};

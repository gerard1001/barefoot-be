/* eslint-disable func-names */
/* eslint-disable object-shorthand */
/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */

const { Model } = require('sequelize');

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
        onDelete:'CASCADE'
      });
      this.hasMany(models.Like, { foreignKey: 'accommodation_id' });
      this.hasMany(models.AccommodationComment, {
        foreignKey: 'accommodation_id'
      });
      this.hasMany(models.arrivalLocation,{foreignKey:'accommodation_id'})
    }
  }
  Accommodation.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      images: DataTypes.ARRAY(DataTypes.STRING),
      imagesId: DataTypes.ARRAY(DataTypes.STRING),
      location_id: DataTypes.INTEGER,
      services: DataTypes.ARRAY(DataTypes.STRING),
      amenities: DataTypes.ARRAY(DataTypes.STRING),
      user_id: DataTypes.INTEGER,
      rates: {
        type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue('rates') || '[]');
        },
        set: function (value) {
          return this.setDataValue('rates', JSON.stringify(value));
        }
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

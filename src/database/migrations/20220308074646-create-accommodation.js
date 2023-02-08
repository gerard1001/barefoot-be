/* eslint-disable func-names */

const { getArray, setArray } = require('../../utils/database.utils');

/* eslint-disable object-shorthand */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Accommodations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      },
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
      location_id: {
        type: DataTypes.INTEGER
      },
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
      user_id: {
        type: DataTypes.INTEGER
      },
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
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Accommodations');
  }
};

const { getArray, setArray } = require('../../utils/database.utils');

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      price: {
        type: DataTypes.STRING
      },
      images: {
        type: DataTypes.TEXT,
        get: getArray('images'),
        set: setArray('images')
      },
      imagesId: {
        type: DataTypes.TEXT,
        get: getArray('imagesId'),
        set: setArray('imagesId')
      },
      details: {
        type: DataTypes.STRING
      },
      isBooked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      accommodation_id: {
        type: DataTypes.INTEGER
      },
      user_id: DataTypes.INTEGER,
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
    await queryInterface.dropTable('Rooms');
  }
};

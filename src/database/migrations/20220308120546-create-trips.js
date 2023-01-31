const { tripStatus } = require('../../utils/trip.util');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM,
        values: tripStatus,
        defaultValue: 'PENDING'
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      manager_id: {
        type: Sequelize.INTEGER
      },
      depart_location_id: {
        type: Sequelize.INTEGER
      },
      arrival_location_id: {
        type: Sequelize.INTEGER
      },
      accommodation_id: {
        type: Sequelize.INTEGER
      },
      reason: {
        type: Sequelize.STRING
      },
      tripDate: {
        type: Sequelize.DATE
      },
      returnDate: {
        type: Sequelize.DATE
      },
      // arrival_location: {
      //   type: Sequelize.ARRAY(Sequelize.JSON)
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Trips');
  }
};

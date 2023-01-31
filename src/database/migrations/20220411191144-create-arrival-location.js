module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('arrivalLocations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TripId: {
        type: Sequelize.INTEGER
      },
      accommodation_id: {
        type: Sequelize.INTEGER
      },
      days: {
        type: Sequelize.INTEGER
      },
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
    await queryInterface.dropTable('arrivalLocations');
  }
};

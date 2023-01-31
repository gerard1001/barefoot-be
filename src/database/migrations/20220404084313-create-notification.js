module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      details: {
        type: DataTypes.STRING
      },
      type: {
        type: DataTypes.STRING
      },
      from_user_id: {
        type: DataTypes.INTEGER
      },
      to_user_id: {
        type: DataTypes.INTEGER
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('notifications');
  }
};

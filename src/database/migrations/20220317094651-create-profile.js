module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      age: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      occupation: {
        type: DataTypes.STRING
      },
      language: {
        type: DataTypes.STRING
      },
      nationality: {
        type: DataTypes.STRING
      },
      bio: {
        type: DataTypes.STRING
      },
      gender: {
        type: DataTypes.STRING
      },
      date_of_birth: {
        type: DataTypes.DATE
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      location_id: {
        type: DataTypes.INTEGER
      },
      country: {
        type: DataTypes.STRING
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
    await queryInterface.dropTable('Profiles');
  }
};

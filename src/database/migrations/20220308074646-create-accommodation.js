/* eslint-disable func-names */
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
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      imagesId: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      location_id: {
        type: DataTypes.INTEGER
      },
      services: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      amenities: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      rates: {
        type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue('rates') || '[]');
        },
        set: function (value) {
          return this.setDataValue('rates', JSON.stringify(value));
        }
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

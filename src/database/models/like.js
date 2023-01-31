/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Accommodation }) {
      // define association here
      this.belongsTo(Accommodation, { foreignKey: 'accommodation_id' });
    }
  }
  Like.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      like: {
        type: DataTypes.BOOLEAN
      }
    },
    {
      sequelize,
      modelName: 'Like'
    }
  );
  return Like;
};

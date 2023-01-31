/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AccommodationComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Accommodation, User }) {
      // define association here
      this.belongsTo(Accommodation, { foreignKey: 'accommodation_id' });
      this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  AccommodationComment.init(
    {
      comment: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'AccommodationComment'
    }
  );
  return AccommodationComment;
};

/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'from_user_id', as: 'sender' });
      this.belongsTo(User, { foreignKey: 'to_user_id', as: 'receiver' });
    }
  }
  notification.init(
    {
      details: {
        type: DataTypes.STRING
      },
      type: DataTypes.STRING,
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'notification'
    }
  );
  return notification;
};

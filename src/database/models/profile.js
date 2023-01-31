/* eslint-disable require-jsdoc */

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate({ User }) {
      // define association here
      this.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  Profile.init(
    {
      age: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      gender: {
        type: DataTypes.STRING
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
      date_of_birth: {
        type: DataTypes.DATE
      },
      country: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: 'Profile'
    }
  );
  return Profile;
};

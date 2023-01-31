/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
const { Model } = require('sequelize');
const roles = require('../../utils/roles.utils');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate({ User }) {
      // define association here
      this.hasMany(User, { foreignKey: 'role_id' });
    }
  }
  Role.init(
    {
      name: {
        type: DataTypes.ENUM,
        values: roles,
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      modelName: 'Role'
    }
  );
  return Role;
};

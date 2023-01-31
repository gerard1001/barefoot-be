/* eslint-disable no-return-await */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable no-throw-literal */
/* eslint-disable class-methods-use-this */
/* eslint-disable require-jsdoc */
import { Role } from 'database/models';
import { User, Profile } from 'database/models';
import { decodeToken } from '../helpers/user.helpers';
import { Blacklist, sequelize } from '../database/models';

export default class UserService {
  async getAllUsers(id) {
    let users;
    if (id === 3) {
      users = await User.findAll({
        where: {
          manager_id: id
        },
        attributes: ['first_name', 'last_name', 'id', 'role_id', 'email']
      });
    } else {
      users = await User.findAll({
        attributes: ['first_name', 'last_name', 'id', 'role_id', 'email']
      });
    }

    const use = users.map((user) => user.dataValues);
    return use;
  }

  async createUser(data) {
    const newUser = await User.create(data);
    return newUser;
  }

  async userExist(email) {
    const user = await User.findOne({ where: { email } });
    if (user) {
      return user;
    }
    return false;
  }

  async userLogin(data, res) {
    const userExist = await User.findOne({
      where: { email: data }
    });

    return userExist;
  }

  async getUserId(id) {
    return User.findOne({ where: { id } });
  }

  async getUser(email) {
    return User.findOne({ where: { email } });
  }

  async userLogout(accessToken) {
    const token = await decodeToken(accessToken);
    const { email } = token;
    const user = await User.findOne({
      where: {
        email
      }
    });

    await Blacklist.create({ token: accessToken });

    return user;
  }

  async getUserwithProfile(email) {
    /* istanbul ignore next */
    return User.findOne({
      where: { email },
      include: {
        model: Profile,
        as: 'profile'
      }
    });
  }

  async updateUserProfile(dataUser, profileData, id) {
    try {
      const results = await sequelize.transaction(async (t) => {
        const user = await User.update(
          dataUser,
          {
            where: {
              id
            },
            returning: true
          },
          { transaction: t }
        );

        const profile = await Profile.update(
          profileData,
          {
            where: {
              user_id: id
            },
            returning: true
          },
          { transaction: t }
        );

        return { user, profile };
      });
      return results;
    } catch (err) {
      /* istanbul ignore next */
      console.log(err);
    }
  }

  static async findById(id) {
    return User.findOne({ where: { id }, include: { model: Role } });
  }

  static async update(data, condition) {
    return User.update(data, { where: { ...condition } });
  }
}

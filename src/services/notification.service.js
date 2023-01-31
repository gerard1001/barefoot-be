/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-return-await */
/* eslint-disable camelcase */
/* eslint-disable require-jsdoc */
import { Op } from 'sequelize';
import { notification, User } from '../database/models';

const userAttributes = [
  'id',
  'first_name',
  'last_name',
  'email',
  'profile_picture'
];

export default class Notification {
  static async createNotification(data) {
    return await notification.create(data);
  }

  static async oneNotification(to_user_id, id) {
    const getnotification = await notification.findOne({
      where: { to_user_id, id },
      include: [
        { model: User, as: 'receiver', attributes: userAttributes },
        { model: User, as: 'sender', attributes: userAttributes }
      ]
    });
    return getnotification;
  }

  static async Allnotification(
    to_user_id,
    offset,
    limit,
    unreadNotifications = 0
  ) {
    const getnotification = await notification.findAndCountAll({
      where: { to_user_id },
      offset,
      limit,
      order: [['isRead', 'ASC']],
      include: [
        { model: User, as: 'receiver', attributes: userAttributes },
        { model: User, as: 'sender', attributes: userAttributes }
      ]
    });
    getnotification.rows.map((notifications) => {
      /* istanbul ignore next */
      if (notifications.isRead === false) {
        unreadNotifications++;
      }
    });
    return { unreadNotifications, getnotification };
  }

  static async updateStatus(to_user_id) {
    const unreadNotifications = await notification.findAll({
      where: { isRead: false, to_user_id }
    });
    await notification.update({ isRead: true }, { where: { to_user_id } });
    const updatedRows = unreadNotifications.map(
      (notifications) => notifications.id
    );

    const result = notification.findAll({
      where: {
        id: {
          [Op.in]: updatedRows
        }
      },
      include: [
        { model: User, as: 'receiver', attributes: userAttributes },
        { model: User, as: 'sender', attributes: userAttributes }
      ]
    });
    return result;
  }

  static async ReadOne(id, to_user_id, unreadNotifications = 0) {
    await notification.update({ isRead: true }, { where: { id } });
    const readOne = await notification.findOne({
      where: { id },
      include: [
        { model: User, as: 'receiver', attributes: userAttributes },
        { model: User, as: 'sender', attributes: userAttributes }
      ]
    });
    const count = await notification.findAll({
      where: { isRead: false, to_user_id }
    });

    count.map(() => {
      unreadNotifications++;
    });
    return { unreadNotifications, readOne };
  }
}

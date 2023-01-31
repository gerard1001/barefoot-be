/* eslint-disable import/newline-after-import */
/* eslint-disable no-unused-vars */
/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
/* eslint-disable require-jsdoc */
import { config } from 'dotenv';
import NotificationService from '../services/notification.service';
import { getPaginatedData, getPagination } from '../utils/pagination.utils';
config();

export default class NotificationController {
  static async oneNotification(req, res) {
    const oneNotification = await NotificationService.oneNotification(
      req.user.id,
      req.params.id
    );
    return res.status(200).json({
      message: 'retrieved one notification successfully',
      data: oneNotification
    });
  }

  static async allnotification(req, res) {
    const { page, limit } = req.query;
    const { offset, newLimit } = getPagination(page, limit);
    const Allnotification = await NotificationService.Allnotification(
      req.user.id,
      offset,
      newLimit
    );

    Allnotification.getnotification = getPaginatedData(
      Allnotification.getnotification,
      page,
      newLimit
    );
    return res.status(200).json({
      message: 'retrieved one notification successfully',
      data: Allnotification
    });
  }

  static async markAllnotification(req, res) {
    const markall = await NotificationService.updateStatus(req.user.id);
    /* istanbul ignore next */
    return res
      .status(200)
      .json({ message: 'mark all notification  successfully', data: markall });
  }

  static async ReadOne(req, res) {
    const updateStatus = await NotificationService.ReadOne(
      req.params.id,
      req.user.id
    );
    /* istanbul ignore next */
    if (updateStatus) {
      return res.status(200).json({
        message: 'Read one notification  successfully',
        data: { updateStatus }
      });
    }
  }
}

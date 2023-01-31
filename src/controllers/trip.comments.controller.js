/* eslint-disable eqeqeq */
/* eslint-disable curly */
/* eslint-disable require-jsdoc */
import tripCommentsServices from '../services/trip.comments.service';
import UserService from '../services/user.service';
import Notification from '../services/notification.service';
import eventEmitter from '../services/event.service';
import { getPaginatedData, getPagination } from '../utils/pagination.utils';

class tripCommentController {
  static async createComment(req, res) {
    try {
      const { user } = req;
      if (
        user.dataValues.id !== req.trip.dataValues.user_id &&
        user.dataValues.manager_id !== req.trip.dataValues.manager_id
      )
        return res.status(400).json({
          message: 'trip does not belong to you.'
        });
      const data = {
        ...req.body,
        user_id: user.dataValues.id,
        trip_id: req.trip.id
      };

      const sendComment = await tripCommentsServices.createComment(data);
      /* istanbul ignore next */
      if (user.role_id != 3) {
        const manager = await new UserService().getUserId(user.manager_id);
        if (manager.in_app_notification == true) {
          const notify = await Notification.createNotification({
            details: `Requester ${user.first_name} ${user.last_name} has commented on a trip request`,
            type: 'comment',
            from_user_id: user.id,
            to_user_id: manager.id
          });
          eventEmitter.emit('appNotification', {
            recipient: manager,
            notify
          });
        }
      }
      /* istanbul ignore next */
      if (user.role_id == 3) {
        const recieveUser = await new UserService().getUserId(req.trip.user_id);
        if (recieveUser.in_app_notification == true) {
          const notify = await Notification.createNotification({
            details: `Manager ${user.first_name} ${user.last_name} has commented on a trip request`,
            type: 'comment',
            from_user_id: user.id,
            to_user_id: recieveUser.id
          });
          eventEmitter.emit('appNotification', {
            recipient: recieveUser,
            notify
          });
        }
      }

      // adds on the comment object the user association manually
      /* istanbul ignore next */
      sendComment.dataValues.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        profile_picture: user.profile_picture
      };

      return res
        .status(201)
        .json({ message: 'comment sent successfully', sendComment });
    } catch (err) {
      return res.status(500).json({ message: 'internal server error', err });
    }
  }

  static async findAllComments(req, res) {
    try {
      const { page, limit } = req.query;
      const { newLimit, offset } = getPagination(page, limit);

      const { id } = req.trip;
      const found = await tripCommentsServices.findTripComments(
        id,
        offset,
        newLimit
      );
      return res.status(200).json({
        message: 'comments retrieved',
        data: getPaginatedData(found, page, newLimit)
      });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ message: 'internal server error', err });
    }
  }

  static async editedComment(req, res) {
    try {
      const { user } = req;
      const foundComment = req.comment.dataValues;
      const commentId = foundComment.id;
      if (
        user.dataValues.id !== req.trip.dataValues.user_id &&
        user.dataValues.manager_id !== req.trip.dataValues.manager_id
      )
        return res.status(409).json({
          message: 'only comment owner is allowed to perform this action'
        });
      /* istanbul ignore next */
      if (user.dataValues.id !== foundComment.user_id)
        return res
          .status(409)
          .json({ message: 'you are not allowed to edit this comment' });
      /* istanbul ignore next */
      const commentUpdate = {
        id: foundComment.id,
        trip_id: foundComment.trip_id,
        user_id: foundComment.user_id,
        comment: req.body.comment ? req.body.comment : foundComment.comment
      };
      await tripCommentsServices.editComment(
        { where: { id: commentId } },
        commentUpdate
      );
      const findEdited = await tripCommentsServices.findSpecificComment(
        commentId
      );

      return res
        .status(200)
        .json({ message: 'comment edited successfully', findEdited });
    } catch (err) {
      return res.status(500).json({ message: 'internal server error', err });
    }
  }

  static async removeComment(req, res) {
    try {
      const { user } = req;
      const foundComment = req.comment.dataValues;
      const commentId = req.comment.dataValues.id;
      if (
        user.dataValues.id !== req.trip.dataValues.user_id &&
        user.dataValues.manager_id !== req.trip.dataValues.manager_id
      )
        return res.status(409).json({
          message: 'you are not allowed to perform this action'
        });
      /* istanbul ignore next */
      if (user.dataValues.id !== foundComment.user_id)
        return res
          .status(400)
          .json({ message: 'you are not allowed to delete this comment' });
      const destroyComment = await tripCommentsServices.removeComment({
        where: { id: commentId }
      });
      return res
        .status(200)
        .json({ message: 'successfuly removed a comment', destroyComment });
    } catch (err) {
      return res.status(500).json({ message: 'internal server error', err });
    }
  }
}
export default tripCommentController;

/* eslint-disable import/no-named-as-default-member */
/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable curly */
/* eslint-disable require-jsdoc */
// eslint-disable-next-line import/no-unresolved
import { Op } from 'sequelize';
import accommodationService from '../services/accommodations.service';
import { getPagination, getPaginatedData } from '../utils/pagination.utils';
import { getQuery } from '../helpers/trip.helpers';
import Notification from '../services/notification.service';
import UserService from '../services/user.service';
import eventEmitter from '../services/event.service';

class accommodationController {
  static async createAccommodation(req, res) {
    try {
      const { user } = req;
      const { name } = req.query;
      /* istanbul ignore next */
      const condition = name
        ? {
            name: {
              [Op.like]: `%${name}%`
            }
          }
        : null;
      const searchAccommodation =
        await accommodationService.findAllAccommodations({ where: condition });
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < searchAccommodation.rows.length - 1; i++) {
        /* istanbul ignore next */
        if (
          searchAccommodation.rows[i].location_id ==
            req.accommodations.value.location_id &&
          searchAccommodation.rows[i].name == req.accommodations.value.name
        ) {
          return res.status(400).json({
            message:
              'could not create an accommodation of the same name and same location.'
          });
        }
      }

      const data = {
        ...req.accommodations.value,
        user_id: user.dataValues.id
      };
      const accommodationCreated =
        await accommodationService.createAccommodation(data);
      return res.status(200).json({
        message: 'successfully created an Accommodation',
        data: accommodationCreated
      });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ message: 'internal server error', err });
    }
  }

  static async findAllAccommodations(req, res) {
    try {
      const { offset, newLimit } = getPagination(
        req.query.page,
        req.query.limit
      );
      const { name } = req.query;
      /* istanbul ignore next */
      const condition = name
        ? {
            name: {
              [Op.like]: `%${name}%`
            }
          }
        : null;
      const foundAccommodations =
        await accommodationService.findAllAccommodations({
          where: condition,
          offset,
          limit: newLimit
        });
      const response = getPaginatedData(
        foundAccommodations,
        req.query.page,
        newLimit
      );
      return res.status(200).json({
        message: 'successfully found all available accommodations',
        data: response
      });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ message: 'internal server error', err });
    }
  }

  static async findAccommodation(req, res) {
    try {
      const foundAccommodation = req.accommodation.dataValues;
      res
        .status(200)
        .json({ message: 'Accommodation found', data: foundAccommodation });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ message: 'internal server error', err });
    }
  }

  static async updateAccommodation(req, res) {
    try {
      const dataUpdate = {
        ...req.accommodations.value
      };
      const accommodationId = req.accommodation.dataValues.id;
      await accommodationService.updateSpecificAccommodation(
        { where: { id: accommodationId } },
        dataUpdate
      );

      const updatedAccommodation =
        await accommodationService.findSpecificAccommodation(accommodationId);
      return res
        .status(200)
        .json({ message: 'Accommodation Updated', updatedAccommodation });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ message: 'internal server error', err });
    }
  }

  static async destroyAccommodation(req, res) {
    try {
      const foundAccommodation = req.accommodation.dataValues;
      const accommodationId = foundAccommodation.id;
      await accommodationService.destroyAccommodation({
        where: { id: accommodationId }
      });
      return res.status(200).json({ message: 'accommodation removed' });
    } catch (err) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  static async likeAccommodation(req, res) {
    try {
      const like = await accommodationService.createLike(
        req.user.id,
        req.params.accommodationId
      );
      const user = await new UserService().getUserId(req.user.id);
      const accommodation =
        await accommodationService.findSpecificAccommodation(
          req.params.accommodationId
        );
      const travel_admin = await new UserService().getUserId(
        accommodation.user_id
      );
      if (like.like == true) {
        const notify = await Notification.createNotification({
          details: `${user.first_name} ${user.last_name} has liked your accommodation`,
          type: 'like',
          from_user_id: user.id,
          to_user_id: travel_admin.id
        });
        /* istanbul ignore next */
        if (travel_admin.in_app_notification == true) {
          eventEmitter.emit('appNotification', {
            recipient: travel_admin,
            notify
          });
        }
      }
      return res.status(200).json({
        message: 'Liked accommodation successfully',
        data: like
      });
    } catch (error) {
      /* istanbul ignore next */
      return res.status(500).json({
        message: 'An unexpected error occurred',
        error: error.message.replace(/['"`]/g, '')
      });
    }
  }

  static async getAllComments(req, res) {
    try {
      const { accommodationId } = req.params;
      const { page, limit } = getQuery(req);
      const { newLimit, offset } = getPagination(page, limit);
      const comments = await accommodationService.getAllComments(
        accommodationId,
        offset,
        newLimit
      );

      return res.status(200).json({
        message: 'Retrieved all comments successfully',
        data: getPaginatedData(comments, page, limit)
      });
    } catch (error) {
      return res.status(500).json({
        message: 'An unexpected error occurred',
        error: error.message.replace(/['"`]/g, '')
      });
    }
  }

  static async createComment(req, res) {
    try {
      const { id: user_id } = req.user;
      const accommodation_id = req.params.accommodationId;
      const { comment } = req.body;

      const createdComment = await accommodationService.createComment(
        accommodation_id,
        user_id,
        comment
      );
      const user = await new UserService().getUserId(req.user.id);
      const accommodation =
        await accommodationService.findSpecificAccommodation(
          req.params.accommodationId
        );
      const travel_admin = await new UserService().getUserId(
        accommodation.user_id
      );
      const notify = await Notification.createNotification({
        details: `${user.first_name} ${user.last_name} has commented on your accommodation`,
        type: 'like',
        from_user_id: user.id,
        to_user_id: travel_admin.id
      });
      /* istanbul ignore next */
      if (travel_admin.in_app_notification == true) {
        eventEmitter.emit('appNotification', {
          recipient: travel_admin,
          notify
        });
      }

      return res.status(201).json({
        message: 'Created the comment successfully',
        data: createdComment
      });
    } catch (error) {
      return res.status(500).json({
        message: 'An unexpected error occurred',
        error: error.message.replace(/['"`]/g, '')
      });
    }
  }

  static async updateComment(req, res) {
    try {
      const { commentId, accommodationId } = req.params;
      const { comment } = req.body;

      const updatedComment = await accommodationService.updateComment(
        commentId,
        accommodationId,
        comment
      );

      return res.status(200).json({
        message: 'Updated comment successfully',
        data: updatedComment[1][0]
      });
    } catch (error) {
      return res.status(500).json({
        message: 'An unexpected error occurred',
        error: error.message.replace(/['"`]/g, '')
      });
    }
  }

  static async deleteComment(req, res) {
    try {
      const { commentId, accommodationId } = req.params;
      await accommodationService.deleteComment(commentId, accommodationId);

      return res.status(200).json({
        message: 'Deleted comment successfully'
      });
    } catch (error) {
      return res.status(500).json({
        message: 'An unexpected error occurred',
        error: error.message.replace(/['"`]/g, '')
      });
    }
  }

  static async rateAccommodation(req, res) {
    try {
      const { rate } = req.body;
      const { id: user_id } = req.user;
      const { accommodationId: accommodation_id } = req.params;

      const accommodation = await accommodationService.rateAccommodation(
        accommodation_id,
        user_id,
        rate
      );
      const user = await new new UserService().getUserId(user_id);
      const travel_admin = await new UserService().getUserId(
        accommodation.user_id
      );
      const notify = await Notification.createNotification({
        details: `${user.first_name} ${user.last_name} has rated your accommodation`,
        type: 'rating',
        from_user_id: user.id,
        to_user_id: travel_admin.id
      });
      /* istanbul ignore next */
      if (travel_admin.in_app_notification == true) {
        eventEmitter.emit('appNotification', {
          recipient: travel_admin,
          notify
        });
      }

      return res.status(200).json({
        message: 'Rated the accommodation successfully',
        data: accommodation
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured while creating a user',
        error: error.message
      });
    }
  }
}

export default accommodationController;

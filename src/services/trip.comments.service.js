/* eslint-disable no-return-await */
/* eslint-disable require-jsdoc */
import { tripComments, User } from '../database/models';

class tripCommentsServices {
  static async createComment(data) {
    return await tripComments.create(data);
  }

  static async findTripComments(tripId, offset, limit) {
    return await tripComments.findAndCountAll({
      where: { trip_id: tripId },
      offset,
      limit,
      order: [['createdAt', 'DESC']],
      include: {
        model: User,
        as: 'user',
        attributes: ['first_name', 'last_name', 'profile_picture']
      }
    });
  }

  static async findSpecificComment(commentId) {
    return await tripComments.findByPk(commentId);
  }

  static async editComment({ where }, commentUpdate) {
    return await tripComments.update(commentUpdate, {
      where,
      returning: true,
      raw: true
    });
  }

  static async removeComment({ where }) {
    return await tripComments.destroy({ where });
  }
}
export default tripCommentsServices;

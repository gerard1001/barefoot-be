/* eslint-disable camelcase */
/* eslint-disable require-jsdoc */
import {
  formatLikeOne,
  formatLikeMany,
  findUserRate,
  formatAvgRates
} from '../helpers/accommodation.hepler';
import {
  Accommodation,
  Room,
  Like,
  AccommodationComment,
  Location,
  User
} from '../database/models';

class accommodationService {
  static async createAccommodation(accommodation) {
    const accommodationsCreate = await Accommodation.create(accommodation);
    return accommodationsCreate;
  }

  static async findAllAccommodations({ where, offset, limit, order }) {
    const foundAccommodations = await Accommodation.findAndCountAll({
      where,
      offset,
      limit,
      order: order || [['id', 'ASC']],
      include: [
        { model: Room, as: 'Rooms' },
        { model: Like, attributes: ['user_id', 'like'] },
        { model: Location, as: 'Locations' }
      ]
    });
    return formatLikeMany(foundAccommodations);
  }

  static async findSpecificAccommodation(id) {
    const foundOneAccommodation = await Accommodation.findByPk(id, {
      include: [
        { model: Room, as: 'Rooms' },
        { model: Like, attributes: ['user_id', 'like'] }
      ]
    });
    return formatLikeOne(foundOneAccommodation);
  }

  static async updateSpecificAccommodation({ where, id }, dataUpdate) {
    /* istanbul ignore next */
    const updateAccommodaton = await Accommodation.update(dataUpdate, {
      where: id ? { id } : where,
      returning: true,
      raw: true
    });
    return updateAccommodaton;
  }

  static async destroyAccommodation({ where }) {
    const destroyAccommodation = await Accommodation.destroy({ where });
    return destroyAccommodation;
  }

  static async createLike(user_id, accommodation_id) {
    let likeData = await Like.findOne({ where: { user_id, accommodation_id } });

    if (!likeData) {
      likeData = await Like.create({
        user_id,
        accommodation_id,
        like: true
      });
    } else if (!likeData.like) {
      likeData.like = true;
    } else {
      likeData.like = null;
    }
    await likeData.save();

    return likeData;
  }

  static async getAllComments(accommodation_id, offset, limit) {
    const comments = await AccommodationComment.findAndCountAll({
      where: { accommodation_id },
      offset,
      limit,
      order: [['id', 'DESC']],
      include: {
        model: User,
        as: 'user',
        attributes: ['first_name', 'last_name', 'profile_picture']
      }
    });

    return comments;
  }

  static async createComment(accommodation_id, user_id, comment) {
    const createdComment = await AccommodationComment.create({
      accommodation_id,
      user_id,
      comment
    });

    return createdComment;
  }

  static async updateComment(id, accommodation_id, comment) {
    const updatedComment = await AccommodationComment.update(
      { comment },
      {
        where: { id, accommodation_id },
        returning: true
      }
    );

    return updatedComment;
  }

  static async deleteComment(id, accommodation_id) {
    await AccommodationComment.destroy({ where: { id, accommodation_id } });
  }

  static async rateAccommodation(accommodation_id, user_id, rate) {
    const accommodation = await Accommodation.findOne({
      where: { id: accommodation_id }
    });

    const rates = findUserRate(accommodation.rates, user_id);
    rates.push({ user_id, rate }); // add the removed rate

    accommodation.rates = rates;
    await accommodation.save();

    return formatAvgRates(accommodation);
  }
}

export default accommodationService;

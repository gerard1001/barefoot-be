/* eslint-disable camelcase */
/* eslint-disable no-return-assign */
/* eslint-disable curly */
/* eslint-disable import/order */
/* eslint-disable no-plusplus */
/* eslint-disable no-return-await */
/* eslint-disable no-await-in-loop */
/* eslint-disable spaced-comment */
/* eslint-disable object-shorthand */
/* eslint-disable require-jsdoc */
import { Trip, Accommodation, arrivalLocation } from '../database/models';

class tripService {
  static async findAllTrips(user, limit, offset) {
    const includes = [
      {
        model: arrivalLocation,
        attributes: ['id', 'accommodation_id', 'days'],
        include: [
          {
            model: Accommodation,
            attributes: ['id', 'name', 'services', 'amenities', 'imagesId'],
            as: 'Accommodation'
          }
        ]
      }
    ];
    if (user.Role.name === 'SUPER_ADMIN')
      return await Trip.findAndCountAll({
        limit,
        offset,
        include: includes
      });

    if (user.Role.name === 'MANAGER') {
      return await Trip.findAndCountAll({
        where: { manager_id: user.id },
        limit,
        offset,
        include: includes
      });
    }

    return await Trip.findAndCountAll({
      where: { user_id: user.id },
      limit,
      offset,
      include: includes
    });
  }

  static async deleteTrip(id) {
    const deleteTrip = await Trip.destroy({
      where: {
        status: 'PENDING',
        id
      }
    });
    return deleteTrip;
  }

  static async findSpecificTripById(tripId) {
    return await Trip.findByPk(tripId, {
      include: [
        {
          model: arrivalLocation,
          include: [
            {
              model: Accommodation,
              attributes: ['name', 'services', 'amenities', 'imagesId'],
              as: 'Accommodation'
            }
          ]
        }
      ]
    });
  }

  static async updateStatus(id, status) {
    await Trip.update(
      { status },
      { where: { id }, returning: true, raw: true }
    );
    const tripStatus = await this.findSpecificTripById(id);
    return tripStatus;
  }

  static async multiCityCreate(userId, managerId, data) {
    data.user_id = userId;
    data.manager_id = managerId;
    const request = await Trip.create(data, {
      include: [arrivalLocation]
    });
    return request;
  }

  static async updateMultiCity(id, data, arrivalLocationdata) {
    try {
      await this.findSpecificTripById(id);
      const updated = await Trip.update(data, {
        where: { id },
        returning: true,
        raw: true
      });

      await arrivalLocation.destroy({ where: { TripId: id } });
      const updateArrivalLocation = await arrivalLocation.bulkCreate(
        arrivalLocationdata.arrivalLocations.map((results) => {
          results.TripId = id;
          return results;
        })
      );
      const results = { updated, updateArrivalLocation };
      return results;
    } catch (err) {
      /* istanbul ignore next */
      console.log(err);
    }
  }
}
export default tripService;

/* eslint-disable curly */
/* eslint-disable no-unused-expressions */
/* eslint-disable require-jsdoc */
import { Op } from 'sequelize';
import locationService from '../services/location.service';
import { getPagination, getPaginatedData } from '../utils/pagination.utils';

class locationController {
  static async locationCreate(req, res) {
    try {
      const data = {
        ...req.body
      };

      const nom = data.name.toLowerCase();
      const county = data.country.toLowerCase();

      data.name = nom;
      data.country = county;

      const create = await locationService.createLocation(data);
      return res.status(201).json({ message: 'location Created', create });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  static async findLocation(req, res) {
    try {
      const { offset, newLimit } = getPagination(
        req.query.page,
        req.query.limit
      );
      const { name, mostvisited } = req.query;

      /* istanbul ignore next */
      let condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
      let order = [['createdAt', 'DESC']];
      if (mostvisited === 'true') {
        condition = {
          visitCount: { [Op.gt]: -1 }
        };
        order = [['visitCount', 'DESC']];
      }
      const foundAccommodations = await locationService.listAllLocation({
        where: condition,
        offset,
        newLimit,
        order
      });
      const response = getPaginatedData(
        foundAccommodations,
        req.query.page,
        newLimit
      );
      return res.status(200).json({
        message: 'successfully found locations',
        data: response
      });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  static async findOneLocation(req, res) {
    try {
      const { locationId } = req.params;
      const foundLocation = await locationService.findLocation(locationId);
      if (!foundLocation)
        return res.status(404).json({ message: 'location not found' });
      return res.status(200).json({ message: 'found Location', foundLocation });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  static async deleteLocation(req, res) {
    try {
      const { locationId } = req.params;
      const { name, country } = req.query;
      await locationService.findLocation(locationId, name, country);
      await locationService.removeLocation({
        where: { id: locationId }
      });
      return res.status(200).json({ message: 'location removed' });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ message: 'internal server error' });
    }
  }
}
export default locationController;

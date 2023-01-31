/* eslint-disable camelcase */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */

import locationService from '../services/location.service';
/* eslint-disable import/prefer-default-export */
export const validateLocationFields = async (req, res, next) => {
  const id = req.body.depart_location_id;
  const location = await locationService.findLocation(id);
  /* istanbul ignore next */
  if (!location) {
    return res
      .status(404)
      .json({ message: `Location with id ${id} not found` });
  }
  return next();
};

export const validateLocationId = async (req, res, next) => {
  try {
    const { location_id } = req.body;
    /* istanbul ignore next */
    if (location_id) {
      const location = await locationService.findLocation(location_id);
      if (!location) {
        return res.status(404).json({ message: `Location with id not found` });
      }

      return next();
    }
    /* istanbul ignore next */
    return next();
  } catch (error) {
    /* istanbul ignore next */

    return res.status(500).json({ message: error.message });
  }
};

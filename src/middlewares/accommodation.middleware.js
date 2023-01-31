/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */
import { Op } from 'sequelize';
import accommodationService from '../services/accommodations.service';

export const checkAccommodationExist = async (req, res, next) => {
  const { name } = req.query;
  /* istanbul ignore next */
  const condition = name
    ? {
        name: {
          [Op.like]: `%${name}%`
        }
      }
    : null;
  const searchAccommodation = await accommodationService.findAllAccommodations({
    where: condition
  });
  for (let i = 0; i < searchAccommodation.rows.length; i++) {
    if (
      searchAccommodation.rows[i].location_id ===
        parseInt(req.body.location_id, 10) &&
      searchAccommodation.rows[i].name === req.body.name
    ) {
      return res.status(400).json({
        message:
          'could not create an accommodation of the same name and same location.'
      });
    }
  }
  return next();
};

export const checkImageSent = (imageFieldName) => async (req, res, next) => {
  const images = req.body[imageFieldName];

  if (!images) {
    if (Array.isArray(images) && images.length < 1) {
      return res.status(400).json({
        message: 'No Image sent! Image is required'
      });
    }
  }

  return next();
};

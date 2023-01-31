/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable curly */
import Joi from 'joi';
// import cloudinary from '../config/cloudinary';

const roomValidation = async (req, res, next) => {
  const roomValidationSchema = Joi.object().keys({
    price: Joi.string().required(),
    images: Joi.array(),
    imagesId: Joi.array(),
    details: Joi.string().required().min(5),
    accommodation_id: Joi.number()
  });

  const results = roomValidationSchema.validate(req.body);
  if (results.error)
    return res.status(400).json({
      message: results.error.details[0].message.replace(/["'`]+/g, '')
    });

  req.rooms = results;
  next();
};

export default roomValidation;

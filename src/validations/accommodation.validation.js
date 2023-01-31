/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable curly */
import Joi from 'joi';

const accommodationValidation = async (req, res, next) => {
  try {
    const services = [];
    const amenities = [];
    if (!Array.isArray(req.body.services)) {
      services.push(req.body.services);
      req.body.services = services;
    }
    if (!Array.isArray(req.body.amenities)) {
      amenities.push(req.body.amenities);
      req.body.amenities = amenities;
    }
    const accommodationValidationSchema = Joi.object({
      name: Joi.string().required().min(3),
      description: Joi.string().required().min(5),
      images: Joi.array().items(Joi.string()).required(),
      imagesId: Joi.array(),
      location_id: Joi.number().required().min(1),
      services: Joi.array().items(Joi.string()).min(0).required(),
      amenities: Joi.array().items(Joi.string()).min(0).required(),
      user_id: Joi.number()
    });
    const results = accommodationValidationSchema.validate(req.body);
    /* istanbul ignore next */
    if (results.error)
      return res.status(400).json({
        message: results.error.details[0].message.replace(/["'`]+/g, '')
      });
    req.accommodations = results;
    next();
  } catch (err) {
    /* istanbul ignore next */
    return res.status(500).json({ message: 'internal server error' });
  }
};

export const commentValidation = (req, res, next) => {
  const commentSchema = Joi.object({
    comment: Joi.string().required().empty()
  });

  const result = commentSchema.validate(req.body);

  if (result.error) {
    res.status(400).json({
      message: result.error.details[0].message.replace(/["'`]+/g, '')
    });
  } else {
    next();
  }
};

export const rateValidation = (req, res, next) => {
  const rateSchema = Joi.object({
    rate: Joi.number().min(1).max(5).required().empty()
  });

  const result = rateSchema.validate(req.body);

  if (result.error) {
    res.status(400).json({
      message: result.error.details[0].message.replace(/["'`]+/g, '')
    });
  } else {
    next();
  }
};

export default accommodationValidation;

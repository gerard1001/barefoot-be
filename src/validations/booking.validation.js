/* eslint-disable require-jsdoc */
import Joi from 'joi';

export default async function bookingValidation(req, res, next) {
  const dateSchema = Joi.object({
    checkinDate: Joi.date().iso().required().empty().min(Date.now()).messages({
      'date.base': 'checkinDate must be a valid date',
      'date.empty': 'checkinDate cannot be empty',
      'any.required': 'checkinDate is required',
      'date.format':
        'checkinDate is not correct, ISO standard must be year-month-day',
      'date.min': 'check in date must not be in the past'
    }),
    checkoutDate: Joi.date().iso().empty().min(req.body.checkinDate).messages({
      'date.base': 'checkoutDate must be valid',
      'any.required': 'checkoutDate is required',
      'date.format':
        'checkoutDate is not correct, ISO standard must be year-month-day',
      'date.min': 'check out date cannot be less than check in date'
    })
  });
  const statusSchema = Joi.object({
    status: Joi.string().required().valid('APPROVED', 'REJECTED').empty()
  });

  const { name } = req.user.Role;
  let validate;
  if (name === 'REQUESTER') {
    validate = dateSchema.validate(req.body);
  } else if (name === 'MANAGER' || name === 'TRAVEL_ADMIN') {
    validate = statusSchema.validate(req.body);
  } else {
    return next();
  }

  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details[0].message.replace(/["'`]+/g, '')
    });
  }

  return next();
}

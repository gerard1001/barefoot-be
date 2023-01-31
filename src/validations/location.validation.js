import Joi from 'joi';

const locationValidation = (req, res, next) => {
  const locationSchema = Joi.object({
    name: Joi.string().required().min(2),
    description: Joi.string().required().min(2),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    country: Joi.string().required().min(2)
  });

  const result = locationSchema.validate(req.body);
  if (result.error) {
    res.status(400).json({
      message: result.error.details[0].message.replace(/["'`]+/g, '')
    });
  } else {
    next();
  }
};

export default locationValidation;

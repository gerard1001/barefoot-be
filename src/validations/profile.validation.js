import Joi from 'joi';

const profileValidation = (req, res, next) => {
  const profileSchema = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    profile_picture: Joi.string().empty(''),
    date_of_birth: Joi.date().iso().empty(''),
    occupation: Joi.string().empty(''),
    nationality: Joi.string().empty(''),
    bio: Joi.string().empty(''),
    gender: Joi.string().empty(''),
    age: Joi.number().empty(''),
    language: Joi.string().empty(''),
    location_id: Joi.number().empty(''),
    in_app_notification: Joi.bool(),
    email_notification: Joi.bool(),
    country: Joi.string().empty('')
  });
  const validating = profileSchema.validate(req.body);
  /* istanbul ignore next */
  if (validating.error) {
    /* istanbul ignore next */
    res.status(400).json({
      message: validating.error.details[0].message.replace(/["'`]+/g, '')
    });
  } else {
    req.profile = validating;
    next();
  }
};

export default profileValidation;

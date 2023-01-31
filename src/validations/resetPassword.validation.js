import joi from '@hapi/joi';

export const EmailValidation = async (req, res, next) => {
  const value = joi
    .object({
      email: joi.string().email().required()
    })
    .validate(req.body);
    /* istanbul ignore next */
  if (value.error) {
    res.json({
      error: 1,
      message: value.error.details[0].message
    });
  } else {
    next();
  }
};
export const PasswordValidation = async (req, res, next) => {
  const value = joi
    .object({
      password: joi
        .string()
        .required()
        .pattern(/^(?=.*[A-Z])(?=.*[0-9])\w{8,}$/)
        .message('Password must atleast have special character and a number')
    })
    .validate(req.body);

  if (value.error) {
    return res.status(400).json({
      error: 1,
      message: value.error.details[0].message
    });
  }

  next();
};

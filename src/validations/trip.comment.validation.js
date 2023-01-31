/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
import joi from 'joi';

export const tripCommentValidation = (req, res, next) => {
  const tripCommentValidationSchema = joi.object({
    comment: joi.string().required().messages({
      'string.empty': 'trip comment field is not allowed to be empty',
      'any.required': 'trip comment field is required'
    })
  });

  const validate = tripCommentValidationSchema.validate(req.body);
  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details[0].message.replace(/["'`]+/g, '')
    });
  }
  next();
};
export default tripCommentValidation;

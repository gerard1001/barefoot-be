/* eslint-disable require-jsdoc */
import accommodationValidationSchema from './accommodation.validation';
import roomValidationSchema from './room.validation';

function validate(schema, value) {
  const { error } = schema.validate(value);
  if (error) return error;
  return false;
}
export { validate, accommodationValidationSchema, roomValidationSchema };

import express from 'express';
import locationController from '../../controllers/location.controller';
import locationValidation from '../../validations/location.validation';
import { roles, checkLoggedInUser } from '../../middlewares/role.middleware';

const locations = express.Router();

locations.post('/', locationValidation, locationController.locationCreate);

locations.get('/', locationController.findLocation);

locations.get('/:locationId', locationController.findOneLocation);

locations.delete(
  '/:locationId',
  checkLoggedInUser,
  roles('TRAVEL_ADMIN', 'REQUESTER', 'SUPER_ADMIN'),
  locationController.deleteLocation
);

export default locations;

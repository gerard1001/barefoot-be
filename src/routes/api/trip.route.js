import express from 'express';
import tripContoller from '../../controllers/trip.controller';
import tripValidation, {
  changestatusValidation
} from '../../validations/trip.validation';
import { checkLoggedInUser, roles } from '../../middlewares/role.middleware';
import {
  checkLocationAccommodation,
  checkTripDates,
  checkTripExistStatus,
  checkTripIdExist,
  checkManagerId,
  checkDuration,
  checkManager
} from '../../middlewares/trip.middleware';
import { validateLocationFields } from '../../middlewares/location.middleware';

const tripRoutes = express.Router();

tripRoutes.get(
  '/',
  checkLoggedInUser,
  roles('REQUESTER', 'MANAGER', 'SUPER_ADMIN'),
  tripContoller.findTrip
);

tripRoutes.get(
  '/:id',
  checkLoggedInUser,
  roles('REQUESTER', 'MANAGER', 'SUPER_ADMIN'),
  tripContoller.findTripById
);

tripRoutes.post(
  '/',
  checkLoggedInUser,
  roles('REQUESTER'),
  checkManager,
  tripValidation,
  validateLocationFields,

  checkTripDates,

  checkLocationAccommodation,
  checkDuration,
  tripContoller.createTrip
);

tripRoutes.put(
  '/:id',
  checkLoggedInUser,
  roles('REQUESTER', 'SUPER_ADMIN'),
  tripValidation,
  checkTripDates,
  checkTripExistStatus('PENDING'),
  validateLocationFields,
  checkLocationAccommodation,
  checkDuration,
  tripContoller.userUpdateTrip
);

tripRoutes.delete(
  '/:id',
  checkLoggedInUser,
  roles('REQUESTER', 'SUPER_ADMIN'),
  checkTripExistStatus('PENDING'),
  tripContoller.deleteTrip
);

tripRoutes.patch(
  '/:id',
  checkLoggedInUser,
  roles('MANAGER', 'SUPER_ADMIN'),
  checkTripIdExist,
  checkManagerId,
  changestatusValidation,
  tripContoller.updateStatus
);
export default tripRoutes;

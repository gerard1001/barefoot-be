import express from 'express';
import home from './api/home.route';
import userRoutes from './api/user.route';
import accommodations from './api/accommodation.route';
import room from './api/room.route';
import locations from './api/location.route';
import tripRoutes from './api/trip.route';
import upload from '../helpers/multer';
import tripCommentRoute from './api/trip.comments.route';
import { validateTripId } from '../middlewares/tripId.middleware';
import searchRoutes from './api/search.routes';
import notification from './api/natification.route';

const routes = express.Router();

routes.use('/home', home);
routes.use('/users', userRoutes);
routes.use('/home', home);
routes.use('/', room);
routes.use('/accommodations', accommodations);
routes.use('/locations', locations);
routes.use('/trips', upload.single(''), tripRoutes);
routes.use('/trips/:tripId/comment', validateTripId, tripCommentRoute);
routes.use('/search', searchRoutes);
routes.use('/notifications', notification);
export default routes;

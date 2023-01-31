import express from 'express';
import { checkLoggedInUser } from '../../middlewares/role.middleware';
import NotificationController from '../../controllers/notification.controller';
import {
  checkNotificationUserExist,
  checkNotificationUserExistone,
  checkallNotificationUserExist,
  checkNotificationExist
} from '../../middlewares/notification.middleware';

const routes = express.Router();
routes.get(
  '/',
  checkLoggedInUser,
  checkallNotificationUserExist,
  NotificationController.allnotification
);
routes.get(
  '/:id',
  checkLoggedInUser,
  checkallNotificationUserExist,
  checkNotificationExist,
  NotificationController.oneNotification
);

routes.patch(
  '/',
  checkLoggedInUser,
  checkNotificationUserExist,
  NotificationController.markAllnotification
);
routes.patch(
  '/:id',
  checkLoggedInUser,
  checkNotificationUserExistone,
  NotificationController.ReadOne
);

export default routes;

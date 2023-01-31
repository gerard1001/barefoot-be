import express from 'express';
import { checkLoggedInUser, roles } from '../../middlewares/role.middleware';
import searchController from '../../controllers/search.controller';

const searchRoutes = express.Router();

searchRoutes.get(
  '/',
  checkLoggedInUser,
  roles('REQUESTER', 'MANAGER', 'SUPER_ADMIN'),
  new searchController().singleSearch
);

export default searchRoutes;

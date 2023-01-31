import express from 'express';
import tripCommentController from '../../controllers/trip.comments.controller';
import { validateCommentId } from '../../middlewares/commentId.middleware';
import { checkLoggedInUser } from '../../middlewares/role.middleware';
import tripCommentValidation from '../../validations/trip.comment.validation';

const tripCommentRoute = express.Router();

tripCommentRoute.post(
  '/',
  checkLoggedInUser,
  tripCommentValidation,
  tripCommentController.createComment
);

tripCommentRoute.get('/', tripCommentController.findAllComments);

tripCommentRoute.patch(
  '/:commentId',
  checkLoggedInUser,
  validateCommentId,
  tripCommentValidation,
  tripCommentController.editedComment
);

tripCommentRoute.delete(
  '/:commentId',
  checkLoggedInUser,
  validateCommentId,
  tripCommentController.removeComment
);

export default tripCommentRoute;

/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable curly */
import accommodationService from '../services/accommodations.service';
import { AccommodationComment } from '../database/models';

// eslint-disable-next-line import/prefer-default-export
export const validateAccommodationId = async (req, res, next) => {
  try {
    const { accommodationId } = req.params;
    const accommodation = await accommodationService.findSpecificAccommodation(
      accommodationId
    );
    if (!accommodation)
      return res.status(404).json({ message: 'Accommodation not found' });
    req.accommodation = accommodation;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'internal server error', error });
  }
};

export const checkUserCreatedComment = async (req, res, next) => {
  const { id } = req.user;
  const { commentId } = req.params;

  const comment = await AccommodationComment.findOne({
    where: { id: commentId }
  });

  // if a logged in user is a super-admin just let him in before checking
  if (req.user.Role.name === 'SUPER_ADMIN') return next();

  if (comment.user_id !== id) {
    return res.status(404).json({
      message: `User didn't create this comment`
    });
  }

  return next();
};

export const checkCommentOnAccommodation = async (req, res, next) => {
  const { accommodationId, commentId } = req.params;

  const comment = await AccommodationComment.findOne({
    where: { id: commentId }
  });

  if (!comment) {
    return res.status(404).json({
      message: `No comment with id ${commentId} exists`
    });
  }

  if (comment.accommodation_id !== parseInt(accommodationId, 10)) {
    return res.status(400).json({
      message: `Comment with id ${commentId} doesn't exist on acommodation with id ${accommodationId}`
    });
  }

  return next();
};

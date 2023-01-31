/* eslint-disable curly */
/* eslint-disable import/prefer-default-export */
import tripCommentService from '../services/trip.comments.service';

export const validateCommentId = async (req, res, next) => {
  const { commentId } = req.params;
  const comment = await tripCommentService.findSpecificComment(commentId);
  /* istanbul ignore next */
  if (!comment)
    return res.status(404).json({ message: 'comment does not exist' });
  req.comment = comment;
  next();
};;

/* eslint-disable curly */
// eslint-disable-next-line import/prefer-default-export
export const isManager = (req, res, next) => {
  if (req.user.role !== 'Manager')
    return res.status(403).json({ message: 'Only Manager has access' });
  return next();
};

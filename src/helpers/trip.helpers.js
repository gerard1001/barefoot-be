/* eslint-disable radix */
/* eslint-disable import/prefer-default-export */
export const getQuery = (req) => {
  const { page, limit } = req.query;
  return {
    page: page && parseInt(page),
    limit: limit && parseInt(limit)
  };
};

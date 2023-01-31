/* eslint-disable camelcase */
/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */

// will take n array of rates and a user id
// return null or the rates array without that rate object if user have not rated or have rated
export const findUserRate = (rates, user_id) => {
  /* istanbul ignore next */
  if (!rates) return rates;

  const newRates = [...rates];

  for (let i = 0; i < newRates.length; i++) {
    /* istanbul ignore next */
    if (newRates[i].user_id === user_id) {
      newRates.splice(i, 1); // remove that rate from the array so that i can re add it in the service
      return newRates;
    }
  }

  return newRates;
};

export const formatAvgRates = (accommodation) => {
  const { rates } = accommodation;
  let sum = 2.5;

  for (let i = 0; i < rates.length; i++) {
    sum += rates[i].rate;
  }

  accommodation.dataValues.rates =
    Math.round((sum / (rates.length + 1)) * 2) / 2;

  return accommodation;
};

export const formatLikeOne = (accommodation) => {
  if (!accommodation) return accommodation;

  const likesArr = accommodation.Likes;

  let likes = 0;

  for (let i = 0; i < likesArr.length; i++) {
    const like = likesArr[i];

    if (like.like) {
      likes++;
    }
  }

  accommodation.dataValues.likes = likes;
  delete accommodation.dataValues.Likes;

  /** will also format the accommodation and add the average rate instead of the array of rates */
  return formatAvgRates(accommodation);
};

export const formatLikeMany = (accommodations) => {
  /* istanbul ignore next */
  if (!accommodations) return accommodations;

  const all = [...accommodations.rows];
  const formattedRows = [];

  for (let i = 0; i < all.length; i++) {
    formattedRows.push(formatLikeOne(all[i]));
  }

  accommodations.rows = formattedRows;

  return accommodations;
};

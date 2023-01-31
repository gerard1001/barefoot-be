/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/prefer-default-export */
import tripService from '../services/trip.service';

export const validateTripId = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await tripService.findSpecificTripById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip does not exist' });
    req.trip = trip;
    next();
  } catch (err) {
    /* istanbul ignore next */
    return res.status(500).json({ message: 'internal server error' });
  }
};

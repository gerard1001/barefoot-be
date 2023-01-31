/* eslint-disable dot-notation */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable curly */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-classes-per-file */
/* eslint-disable require-jsdoc */
import { Op, Sequelize } from 'sequelize';
import searchServices from '../services/search.service';
import { Trip, User, Location } from '../database/models';
import { getPaginatedData, getPagination } from '../utils/pagination.utils';

class searchController {
  async singleSearch(req, res) {
    try {
      const incomingPage = req.query['page'];
      const incomingLimit = req.query['limit'];
      const { offset, newLimit } = getPagination(incomingPage, incomingLimit);

      // delete the offset and limit entries after extracting them to
      // make the app still work as original
      if (req.query.page) {
        delete req.query.page;
      }
      if (req.query.limit) {
        delete req.query.limit;
      }

      const trips = [];
      /* istanbul ignore next */
      class TripObj {
        /* istanbul ignore next */
        constructor(id, acc) {
          this.id = id;
          this.accommodation = acc;
        }
      }

      const dat = await Trip.findAndCountAll({
        where: {
          [Op.or]: {
            user_id: req.user.id,
            manager_id: req.user.id
          }
        },
        offset,
        newLimit
      });

      const arr = [];
      let data;

      const keys = Object.keys(req.query);
      /* istanbul ignore next */
      if (keys.length === 0) {
        data = await searchServices.noQuery(req.user, offset, newLimit);
        if (data.rows.length < 1)
          return res
            .status(400)
            .json({ message: 'oops! seems like there are no trips yet' });
      }

      const queries = [];

      const owners = await User.findAll({
        where: {
          [Op.or]: {
            first_name: {
              [Op.like]: `%${req.query.owner}%`
            },

            last_name: {
              [Op.like]: `%${req.query.owner}%`
            }
          }
        },
        offset,
        newLimit
      });
      const ownerId = owners.map((owner) => owner.id);

      for (const by in req.query) {
        let query = req.query[by];

        if (req.query.from === undefined && req.query.to === undefined) {
          req.query.from = new Date('5000-10-10');
          req.query.to = new Date('5000-10-10');
        }

        if (by === 'duration' || by === 'endDate') {
          query = +query;
          queries.push({
            tripDate: { [Op.gte]: req.query.duration },
            returnDate: { [Op.lte]: req.query.endDate }
          });
        } else if (by === 'owner') {
          queries.push({ user_id: { [Op.in]: ownerId } });
        } else if (by === 'destination') {
          const loc = req.query.destination.toLowerCase();
          const location = await Location.findOne({
            where: {
              name: {
                [Op.like]: `%${loc}%`
              }
            }
          });

          for (let i = 0; i <= dat.length - 1; i++) {
            /* istanbul ignore next */
            if (dat[i].arrival_location) {
              /* istanbul ignore next */
              for (let b = 0; b <= dat[i].arrival_location.length; b++) {
                if (dat[i].arrival_location[b]) {
                  /* istanbul ignore next */
                  const dt = new TripObj(
                    dat[i].id,
                    dat[i].arrival_location[b].accommodation_id
                  );
                  trips.push(dt);
                }
              }
            }
          }

          for (let k = 0; k <= trips.length - 1; k++) {
            /* istanbul ignore next */
            if (trips[k].accommodation === location.dataValues.id) {
              /* istanbul ignore next */
              arr.push(trips[k].id);
            }
          }

          queries.push({ id: { [Op.in]: arr } });
        } else {
          const cas = req.query.status.toUpperCase();
          queries.push({
            status: Sequelize.literal(`"status"::TEXT LIKE '%${cas}%'`)
          });
        }
      }

      const userId = req.user.id;

      if (req.user.Role.id === 3 || req.user.Role.id === 4) {
        data = await Trip.findAndCountAll({
          where: {
            [Op.and]: queries,
            [Op.or]: [{ user_id: userId }, { manager_id: userId }]
          },
          offset,
          newLimit
        });
        if (data.rows.length < 1)
          return res.status(400).json({ message: 'no data found' });
        return res.status(200).json({
          messsage: 'Search result retrieved successfully',
          data: getPaginatedData(data, incomingPage, newLimit)
        });
      }

      data = await Trip.findAndCountAll({
        where: {
          [Op.and]: queries
        },
        offset,
        newLimit
      });

      if (data.rows.length < 1)
        return res.status(400).json({ message: 'no data found' });

      return res.status(200).json({
        message: 'Retrieved result successfully',
        data: getPaginatedData(data, incomingPage, newLimit)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default searchController;

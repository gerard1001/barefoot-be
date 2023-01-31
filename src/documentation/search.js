import responses from './response';

const search = {
  '/search': {
    get: {
      tags: ['search'],
      summary: 'search for trips',
      operationId: 'searchTrips',
      parameters: [
        {
          name: 'page',
          in: 'query',
          type: 'integer'
        },
        {
          name: 'limit',
          in: 'query',
          type: 'integer'
        },
        {
          name: 'owner',
          description: 'enter name',
          in: 'query',
          type: 'string'
        },
        {
          name: 'status',
          description: 'enter status',
          in: 'query',
          type: 'string'
        },
        {
          name: 'duration',
          description: 'enter starting date',
          in: 'query',
          type: 'date'
        },
        {
          name: 'endDate',
          description: 'enter ending date',
          in: 'query',
          type: 'date'
        },
        {
          name: 'destination',
          description: 'enter destination',
          in: 'query',
          type: 'string'
        }
      ],
      responses,
      security: [
        {
          JWT: []
        }
      ]
    }
  }
};
export default search;

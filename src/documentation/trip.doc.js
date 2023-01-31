/* eslint-disable import/prefer-default-export */
/* eslint-disable no-dupe-keys */
import responses from './response';

export const trip = {
  '/trips/?page={page}&limit={limit}': {
    get: {
      tags: ['Trip'],
      summary: 'Requester Retrieving all TripRequest ',
      description: 'Retrieve TripRequest',
      operationId: 'Retrieve TripRequest',
      parameters: [
        {
          name: 'page',
          in: 'path',
          type: 'integer',
          required: true
        },
        {
          name: 'limit',
          in: 'path',
          type: 'integer',
          required: true
        }
      ],
      responses,
      security: [
        {
          JWT: []
        }
      ]
    }
  },
  '/trips': {
    post: {
      tags: ['Trip'],
      summary: 'Sending Trip request',
      description: 'User create Trip request',

      produces: ['application/json'],
      operationId: 'postTrip',
      parameters: [
        {
          name: 'Trip',
          in: 'body',
          type: 'object',
          properties: {
            reason: {
              type: 'string'
            },
            depart_location_id: {
              type: 'integer'
            },
            tripDate: {
              type: 'string'
            },
            returnDate: {
              type: 'string'
            },

            arrivalLocations: {
              type: 'array',
              items: {
                name: 'trip',
                type: 'object',
                properties: {
                  accommodation_id: {
                    type: 'integer'
                  },
                  days: {
                    type: 'integer'
                  }
                }
              }
            }
          }
        }
      ],
      security: [
        {
          JWT: []
        }
      ],
      responses
    }
  },
  '/trips/{id}': {
    put: {
      tags: ['Trip'],
      summary: 'Requester Update trip request with pending status',
      description: 'Update the trip',
      operationId: 'Trip',
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'Add tripId',
          required: true
        },
        {
          name: 'Trip',
          in: 'body',
          type: 'object',
          properties: {
            reason: {
              type: 'string'
            },
            depart_location_id: {
              type: 'integer'
            },
            tripDate: {
              type: 'string'
            },
            returnDate: {
              type: 'string'
            },

            arrivalLocations: {
              type: 'array',
              items: {
                name: 'trip',
                type: 'object',
                properties: {
                  accommodation_id: {
                    type: 'integer'
                  },
                  days: {
                    type: 'integer'
                  }
                }
              }
            }
          }
        }
      ],
      security: [
        {
          JWT: []
        }
      ],
      responses
    },
    delete: {
      tags: ['Trip'],
      summary: 'Requester Delete Trip Request with pending status',
      description: 'Delete TripRequest',
      operationId: 'deleteTripRequest',
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'Add tripId',
          required: true
        }
      ],
      security: [
        {
          JWT: []
        }
      ],
      responses
    },

    patch: {
      tags: ['Trip'],
      summary: 'Manager reject or approve Trip Request with pending status',
      description: 'Approved and reject TripRequest',
      operationId: 'Reject or approve TripRequest',
      security: [
        {
          JWT: []
        }
      ],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            example: 'Id'
          }
        },
        {
          in: 'body',
          name: 'status',
          required: true,
          schema: {
            example: {
              status: 'status'
            }
          }
        }
      ],
      consumes: ['application/json'],
      responses
    },
    get: {
      tags: ['Trip'],
      summary: 'get a single trip by id',
      description: 'get trip by id',
      operationId: 'get trip by id',
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'Add tripId',
          required: true
        }
      ],
      security: [
        {
          JWT: []
        }
      ],
      responses
    }
  }
};

export const tripDefinitions = {
  location: {
    type: 'object',
    properties: {
      accommodation_id: {
        type: 'string'
      },
      days: {
        type: 'string'
      }
    }
  }
};

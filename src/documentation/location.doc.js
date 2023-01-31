/* eslint-disable import/prefer-default-export */
import responses from './response';

export const locations = {
  '/locations': {
    post: {
      tags: ['location'],
      summary: 'accommodation Locations',
      description: 'createalocation',
      operationId: 'create alocation',
      consumes: 'application/json',
      produces: 'application/json',
      parameters: [
        {
          name: 'body',
          in: 'body',
          required: true,
          schema: {
            $ref: '#/definitions/locationFields'
          }
        }
      ],
      responses,
      security: [
        {
          JWT: []
        }
      ]
    },
    get: {
      tags: ['location'],
      summary: 'retrieve all available locations',
      description: 'list of all locations',
      operationId: 'location Listing',
      produces: 'application/json',
      parameters: [
        {
          name: 'mostvisited',
          in: 'query',
          required: false,
          type: 'boolean'
        }
      ],
      responses
    }
  },
  '/locations/{locationId}': {
    get: {
      tags: ['location'],
      summary: 'get a single location using id and query strings',
      description: 'use of query string and ids to find specific data',
      operationId: 'get Single location Id',
      produces: 'application/json',
      parameters: [
        {
          name: 'locationId',
          in: 'path',
          required: true,
          type: 'integer'
        }
      ],
      responses
    },
    delete: {
      tags: ['location'],
      summary: 'Delete a location withspecific Id',
      description:
        'delete a locationwith a specific locationId and query strings',
      produces: 'application/json',
      parameters: [
        {
          name: 'locationId',
          in: 'path',
          required: true,
          type: 'integer'
        },
        {
          name: 'name',
          in: 'query',
          required: true
        },
        {
          name: 'country',
          in: 'query',
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
  }
};

export const locationDefinitions = {
  locationFields: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        required: true
      },
      description: {
        type: 'string',
        required: true
      },
      country: {
        type: 'string',
        required: true
      },
      longitude: {
        type: 'number',
        required: true
      },
      latitude: {
        type: 'number',
        required: true
      }
    }
  }
};

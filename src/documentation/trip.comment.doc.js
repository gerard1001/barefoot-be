/* eslint-disable import/prefer-default-export */
import responses from './response';

export const tripComments = {
  '/trips/{tripId}/comment': {
    post: {
      tags: ['tripComment'],
      summary: 'this endpoint is for commenting on a trip',
      description: 'commenting on a trip',
      operationId: 'commenting on a trip',
      consumes: ['application/json'],
      produces: ['application/json'],
      parameters: [
        {
          name: 'tripId',
          in: 'path',
          required: true
        },
        {
          name: 'body',
          in: 'body',
          required: true,
          schema: {
            $ref: '#/definitions/tripCommentSchema'
          }
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
  '/trips/{tripId}/comment?page={page}&limit={limit}': {
    get: {
      tags: ['tripComment'],
      summary: 'listing all comments on a trip',
      description: 'listing all trips comments',
      operationId: 'comments listing',
      produces: ['application/json'],
      parameters: [
        {
          name: 'page',
          in: 'path',
          required: true,
          type: 'integer'
        },
        {
          name: 'limit',
          in: 'path',
          required: true,
          type: 'integer'
        },
        {
          name: 'tripId',
          in: 'path',
          required: true
        }
      ],
      responses
    }
  },
  '/trips/{tripId}/comment/{commentId}': {
    patch: {
      tags: ['tripComment'],
      summary: 'this endpoint is for updating a comment on a trip',
      description: 'editing a comment on a trip',
      operationId: 'editing a comment on a trip',
      consumes: ['application/json'],
      produces: ['application/json'],
      parameters: [
        {
          name: 'tripId',
          in: 'path',
          required: true
        },
        {
          name: 'commentId',
          in: 'path',
          required: true
        },
        {
          name: 'body',
          in: 'body',
          required: true,
          schema: {
            $ref: '#/definitions/tripCommentSchema'
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
    delete: {
      tags: ['tripComment'],
      summary: 'deleting a comment on a trip',
      description: 'removing a comment from trips comment list',
      operationId: 'deleting a comment',
      produces: ['application/json'],
      parameters: [
        {
          name: 'tripId',
          in: 'path',
          required: true
        },
        {
          name: 'commentId',
          in: 'path',
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
export const tripCommentDefinitions = {
  tripCommentSchema: {
    type: 'object',
    properties: {
      comment: {
        type: 'string',
        required: true
      }
    }
  }
};

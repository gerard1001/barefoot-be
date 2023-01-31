import responses from './response';

export const booking = {
  '/rooms/{roomId}/booking': {
    post: {
      tags: ['Booking'],
      summary: 'room booking',
      description: 'book a specific room in accommodation',
      operationId: 'book a a specific room',
      consumes: 'application/json',
      produces: 'application/json',
      parameters: [
        {
          name: 'roomId',
          in: 'path',
          description: 'room id',
          required: true,
          type: 'integer'
        },
        {
          name: 'body',
          in: 'body',
          description: 'book a room',
          required: false,
          schema: {
            $ref: '#/definitions/booking'
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
      tags: ['Booking'],
      summary: 'get all booking information of a specific room',
      description: 'get bookings of a specific room',
      operationId: 'get all booking info in a specific room',
      produces: ['application/json'],
      parameters: [
        {
          name: 'roomId',
          in: 'path',
          description: 'room id',
          required: true,
          type: 'integer'
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
  '/rooms/booking': {
    get: {
      tags: ['Booking'],
      summary: 'get all booking information of a user',
      description: 'get all user bookings',
      operationId: 'get user booking info',
      produces: ['application/json'],
      responses,
      security: [
        {
          JWT: []
        }
      ]
    }
  },
  '/rooms/{roomId}/booking/{bookingId}': {
    get: {
      tags: ['Booking'],
      summary: 'get one booking',
      description: 'get specific booking information',
      operationId: 'get one booking info',
      produces: ['application/json'],
      parameters: [
        {
          name: 'roomId',
          in: 'path',
          required: true,
          description: 'room id',
          type: 'integer'
        },
        {
          name: 'bookingId',
          in: 'path',
          required: true,
          description: 'booking id',
          type: 'integer'
        }
      ],
      responses,
      security: [
        {
          JWT: []
        }
      ]
    },
    patch: {
      tags: ['Booking'],
      summary: 'update booking information',
      description: 'update specific booking information in a room',
      operationId: 'update a booking of a room',
      parameters: [
        {
          name: 'roomId',
          in: 'path',
          required: true,
          description: 'room id',
          type: 'integer'
        },
        {
          name: 'bookingId',
          in: 'path',
          description: 'booking id',
          required: true,
          type: 'integer'
        },
        {
          name: 'body',
          in: 'body',
          description: 'book a room',
          required: false,
          schema: {
            $ref: '#/definitions/bookingStatus'
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
      tags: ['Booking'],
      summary: 'Delete/Remove a specific booking',
      description: 'delete booking info',
      operationId: 'remove a booking',
      produces: ['application/json'],
      parameters: [
        {
          name: 'roomId',
          in: 'path',
          required: true,
          description: 'room id',
          type: 'integer'
        },
        {
          name: 'bookingId',
          in: 'path',
          required: true,
          description: 'booking id',
          type: 'integer'
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

export const bookingDefinitions = {
  booking: {
    type: 'object',
    properties: {
      checkinDate: {
        type: 'string',
        required: false,
        format: 'date-time'
      },
      checkoutDate: {
        type: 'string',
        required: false,
        format: 'date-time'
      }
    }
  },

  bookingStatus: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        required: false
      },
      checkinDate: {
        type: 'string',
        required: false,
        format: 'date-time'
      },
      checkoutDate: {
        type: 'string',
        required: false,
        format: 'date-time'
      }
    }
  }
};

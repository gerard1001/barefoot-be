import responses from './response';

const room = {
  '/accommodations/{accommodationId}/rooms': {
    post: {
      tags: ['Room'],
      summary: 'create a Room',
      description: 'create a room in an accommodation',
      operationId: 'create a Room',
      consumes: ['multipart/form-data'],
      produces: ['application/json'],
      parameters: [
        {
          name: 'accommodationId',
          in: 'path',
          type: 'integer',
          required: true
        },
        {
          name: 'price',
          in: 'formData',
          required: true,
          type: 'string'
        },
        {
          name: 'details',
          in: 'formData',
          required: true,
          type: 'string'
        },
        {
          name: 'images',
          in: 'formData',
          required: true,
          type: 'file'
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
      tags: ['Room'],
      summary: 'get all rooms of a given accommodation',
      description: 'get all rooms that are located in a given accommodation',
      operationId: 'get accommodation rooms',
      produces: ['application/json'],
      parameters: [
        {
          name: 'accommodationId',
          in: 'path',
          description: 'accommodation id',
          required: true,
          type: 'integer'
        }
      ],
      responses
    }
  },

  '/accommodations/{accommodationId}/rooms/{roomId}': {
    get: {
      tags: ['Room'],
      summary: 'get a specific Room in a specific accommodation',
      description: 'get a room of a given accommodation',
      operationId: 'get a room in an accommodation',
      produces: ['application/json'],
      parameters: [
        {
          name: 'accommodationId',
          in: 'path',
          description: 'accommodation id',
          required: true,
          type: 'integer'
        },
        {
          name: 'roomId',
          in: 'path',
          description: 'room id',
          required: true,
          type: 'integer'
        }
      ],
      responses
    },
    put: {
      tags: ['Room'],
      summary: 'update a Room specifications',
      description: 'update a Room specifications in a specific accommodation',
      operationId: 'update a Room of an accommodation',
      consumes: ['multipart/form-data'],
      produces: ['application/json'],
      parameters: [
        {
          name: 'accommodationId',
          in: 'path',
          description: 'accommodation id',
          required: true,
          type: 'integer'
        },
        {
          name: 'roomId',
          in: 'path',
          description: 'room id',
          type: 'integer',
          required: true
        },
        {
          name: 'price',
          in: 'formData',
          type: 'string',
          required: true
        },
        {
          name: 'details',
          in: 'formData',
          type: 'string',
          required: true
        },
        {
          name: 'images',
          in: 'formData',
          type: 'file',
          required: true
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
      tags: ['Room'],
      summary: 'Delete/Remove a room from a specific accommodation',
      description: 'delete a Room',
      operationId: 'remove a Room in an accmmodation room',
      produces: ['application/json'],
      parameters: [
        {
          name: 'accommodationId',
          in: 'path',
          required: true,
          description: 'accommodation id',
          type: 'integer'
        },
        {
          name: 'roomId',
          in: 'path',
          required: true,
          description: 'roomId',
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

export default room;

import responses from './response';

const notification = {
  '/notifications?page={page}&limit={limit}': {
    get: {
      summary: 'get all notification',
      tags: ['Notification'],
      parameters: [
        {
          name: 'page',
          in: 'path',
          type: 'integer'
        },
        {
          name: 'limit',
          in: 'path',
          type: 'integer'
        }
      ],
      security: [
        {
          JWT: []
        }
      ],
      consumes: ['application/json'],
      responses
    },
    patch: {
      summary: 'mark all notifications as read',
      tags: ['Notification'],
      security: [
        {
          JWT: []
        }
      ],
      consumes: ['application/json'],
      responses
    }
  },
  '/notifications/{id}': {
    get: {
      summary: 'Reads one notifications',
      tags: ['Notification'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          description: 'enter id',
          required: true,
          type: 'integer'
        }
      ],
      security: [
        {
          JWT: []
        }
      ],
      consumes: ['application/json'],
      responses
    },
    patch: {
      summary: 'Reads one notifications',
      tags: ['Notification'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          description: 'enter  id',
          required: true,
          type: 'integer'
        }
      ],
      security: [
        {
          JWT: []
        }
      ],
      consumes: ['application/json'],
      responses
    }
  }
};
export default notification;

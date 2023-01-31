import responses from './response';

export const user = {
  '/users/': {
    get: {
      tags: ['User'],
      summary: 'Get All users',
      description: 'Get All users',
      operationId: 'getAllUsers',
      security: [
        {
          JWT: []
        }
      ],
      responses
    }
  },
  '/users/getOne': {
    get: {
      tags: ['User'],
      summary: 'Get one users',
      description: 'Get one users',
      operationId: 'getOneUsers',
      security: [
        {
          JWT: []
        }
      ],
      responses
    }
  },
  '/users/:id': {
    get: {
      tags: ['User'],
      summary: 'Get All users',
      description: 'Get All users',
      operationId: 'getAllUsers',
      security: [
        {
          JWT: []
        }
      ],
      responses
    }
  },
  '/users/register': {
    post: {
      tags: ['User'],
      summary: 'Register',
      description: 'Register a user',
      operationId: 'postUsersRegister',
      parameters: [
        {
          name: 'body',
          in: 'body',
          description: 'Register a user',
          required: true,
          schema: {
            $ref: '#/definitions/register'
          }
        }
      ],
      responses
    }
  },
  '/users/verify-email/{token}': {
    get: {
      tags: ['User'],
      summary: 'Verify',
      description: 'Verify a user',
      operationId: 'getVerifyUser',
      parameters: [
        {
          name: 'token',
          in: 'path',
          description: 'Register a user',
          required: true
        }
      ],
      responses
    }
  },
  '/users/login': {
    post: {
      tags: ['User'],
      summary: 'login',
      description: 'user login route',
      parameters: [
        {
          name: 'body',
          in: 'body',
          description: 'user login',
          required: true,
          schema: {
            $ref: '#/definitions/login'
          }
        }
      ],
      responses
    }
  },
  '/users/google/login': {
    get: {
      tags: ['User'],
      summary: 'login with google',
      description: 'user login route',
      responses
    }
  },
  '/users/facebook/login': {
    get: {
      tags: ['User'],
      summary: 'login with facebook',
      description: 'user login route',
      responses
    }
  },
  '/users/logout': {
    post: {
      tags: ['User'],
      summary: 'logout',
      description: 'Logout a user',
      operationId: 'postUsersLogout',
      parameters: [
        {
          name: 'authorization',
          in: 'header',
          description: 'user logout',
          required: true
        }
      ],
      responses
    }
  },
  '/users/profile': {
    patch: {
      tags: ['User'],
      summary: 'profile',
      description: 'user update their profile',
      parameters: [
        {
          in: 'header',
          name: 'Authorization',
          required: true,
          description: 'Authorization'
        },
        {
          name: 'first_name',
          in: 'formData',
          description: 'first name',
          type: 'string'
        },
        {
          name: 'last_name',
          in: 'formData',
          description: 'last name',
          type: 'string'
        },
        {
          name: 'age',
          in: 'formData',
          description: 'user age',
          type: 'integer'
        },
        {
          name: 'occupation',
          description: 'user occupation',
          in: 'formData',
          type: 'string'
        },
        {
          name: 'language',
          in: 'formData',
          description: 'user language',
          type: 'string'
        },
        {
          name: 'nationality',
          in: 'formData',
          description: 'user nationality',
          type: 'string'
        },
        {
          name: 'bio',
          in: 'formData',
          description: 'description about the user',
          type: 'string'
        },
        {
          name: 'gender',
          in: 'formData',
          description: 'user gender',
          type: 'string'
        },
        {
          name: 'profile_picture',
          in: 'formData',
          description: 'last name',
          type: 'file'
        },
        {
          name: 'date_of_birth',
          in: 'formData',
          description: 'date of birth',
          type: 'string',
          format: 'date-time'
        },
        {
          name: 'location_id',
          in: 'formData',
          description: 'location_id',
          type: 'integer'
        },
        {
          name: 'in_app_notification',
          in: 'formData',
          description: 'in app notification',
          type: 'boolean'
        },
        {
          name: 'email_notification',
          in: 'formData',
          description: 'email notification',
          type: 'boolean'
        }
      ],
      responses
    }
  }
};

export const userDefinitions = {
  register: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      },
      first_name: {
        type: 'string',
        required: true
      },
      last_name: {
        type: 'string',
        required: true
      },
      location_id: {
        type: 'integer',
        required: true
      }
    }
  },

  login: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    }
  }
};

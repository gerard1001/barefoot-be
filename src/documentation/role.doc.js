import responses from './response';
import roles from '../utils/roles.utils';

export const role = {
  '/users/assignRole': {
    patch: {
      tags: ['User'],
      summary: 'assign a role',
      description: 'assign a role a user',
      operationId: 'postUsersAssignRole',
      parameters: [
        {
          name: 'body',
          in: 'body',
          description: 'Assign a role a user',
          required: true,
          schema: {
            $ref: '#/definitions/assignRole'
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

  '/users/getRoles': {
    get: {
      tags: ['User'],
      summary: 'get all roles',
      description: 'get all user roles',
      operationId: 'getUsersRoles',
      responses,
      security: [
        {
          JWT: []
        }
      ]
    }
  }
};

export const assignRoleDefinitions = {
  assignRole: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        required: true
      },
      role: {
        type: 'string',
        enum: roles,
        required: true
      }
    }
  }
};

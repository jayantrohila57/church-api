export const UserDocs = {
  paths: {
    '/users': {
      get: {
        summary: 'Get all users',
        tags: ['User'],
        responses: {
          '200': {
            description: 'Successfully retrieved all users',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
      post: {
        summary: 'Create a new user',
        tags: ['User'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User created successfully',
          },
          '400': {
            description: 'Bad request',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/users/{id}': {
      get: {
        summary: 'Get user by ID',
        tags: ['User'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the user',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Successfully retrieved user by ID',
          },
          '404': {
            description: 'User not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
      put: {
        summary: 'Update user by ID',
        tags: ['User'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the user',
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User updated successfully',
          },
          '400': {
            description: 'Bad request',
          },
          '404': {
            description: 'User not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
      delete: {
        summary: 'Delete user by ID',
        tags: ['User'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the user',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'User deleted successfully',
          },
          '404': {
            description: 'User not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
  },
}

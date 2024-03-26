export const AuthDocs = {
  paths: {
    '/auth/sign-up': {
      post: {
        summary: 'Sign up a user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  email: {
                    type: 'string',
                  },
                  password: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successfully Signed Up',
          },
          '400': {
            description: 'Bad request',
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/auth/sign-in': {
      post: {
        summary: 'Sign in a new user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                  },
                  password: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User signed in successfully',
          },
          '400': {
            description: 'Bad request',
          },
        },
      },
    },
    '/auth/verify-email': {
      get: {
        summary: 'Verify user email using the provided token',
        tags: ['Authentication'],
        parameters: [
          {
            in: 'query',
            name: 'token',
            description: 'The verification token received from the frontend',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Account successfully verified. You can now log in.',
          },
          '400': {
            description: 'Invalid token or bad request',
          },
          '401': {
            description: 'Unauthorized',
          },
        },
        security: [],
      },
    },
    '/auth/forgot-Password': {
      post: {
        summary:
          "Initiate the process of resetting the user's password by sending a reset link to the registered email",
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Password reset link sent successfully',
          },
          '400': {
            description: 'Bad request',
          },
        },
      },
    },
    '/auth/reset-Password': {
      post: {
        summary: "Reset the user's password using the provided token",
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string',
                  },
                  newPassword: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Password reset successfully. You can now log in with the new password.',
          },
          '400': {
            description: 'Invalid token or bad request',
          },
          '401': {
            description: 'Unauthorized',
          },
        },
        security: [],
      },
    },
    '/auth/verify-reset-Password': {
      get: {
        summary: 'Verify the reset password token before allowing the user to reset their password',
        tags: ['Authentication'],
        parameters: [
          {
            in: 'query',
            name: 'token',
            description: 'The reset password token received from the frontend',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Token is valid. Proceed with password reset.',
          },
          '400': {
            description: 'Invalid token or bad request',
          },
          '401': {
            description: 'Unauthorized',
          },
        },
        security: [],
      },
    },
  },
}

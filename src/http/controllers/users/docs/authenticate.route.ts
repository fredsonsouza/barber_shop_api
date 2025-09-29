import { authenticate } from '../authenticate'
import {
  authenticateResponseSchema,
  authenticateUserBodySchema,
  invalidCredentialsResponseSchema,
} from '../schemas/authenticate.schema'

export const authenticateRoute = {
  method: 'POST',
  url: '/sessions',
  schema: {
    description:
      'Authenticate a user and returns JWT access token. Sets the Refresh Token in an HTTP-only cookie.',
    tags: ['Users'],
    body: authenticateUserBodySchema,
    response: {
      200: authenticateResponseSchema,
      400: invalidCredentialsResponseSchema,
    },
  },
  handler: authenticate,
}

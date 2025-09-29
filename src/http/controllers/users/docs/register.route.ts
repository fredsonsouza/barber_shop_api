import { register } from '../register'
import {
  errorResponseSchema,
  registerBodySchema,
  successResponseSchema,
} from '../schemas/register.schema'

export const registerRoute = {
  method: 'POST',
  url: '/users',
  schema: {
    description: 'Register a new user',
    tags: ['Users'],
    body: registerBodySchema,
    response: {
      201: successResponseSchema,
      409: errorResponseSchema,
    },
  },
  handler: register,
}

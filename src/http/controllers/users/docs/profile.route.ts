import z from 'zod'
import { profile } from '../profile'
import {
  profileNotFoundSchema,
  profileResponseSchema,
  unauthorizedSchema,
} from '../schemas/profile.schema'
;('../schemas/profile.schema')

export const profileRoute = {
  method: 'GET',
  url: '/me',
  schema: {
    description: 'Get authenticated user profile',
    tags: ['Users'],
    security: [
      {
        bearerAuth: [],
      },
    ],
    response: {
      200: profileResponseSchema,
      401: unauthorizedSchema,
      404: profileNotFoundSchema,
    },
  },

  handler: profile,
}

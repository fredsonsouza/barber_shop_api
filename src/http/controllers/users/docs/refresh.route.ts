import { refresh } from '../refresh'
import {
  refreshResponseSchema,
  unauthorizedErrorSchema,
} from '../schemas/refresh.schema'

export const refreshRoute = {
  method: 'PATCH',
  url: '/token/refresh',
  schema: {
    description:
      'Renews the access token (JWT) and Refresh Token using the Refresh Token stored in the cookie',
    tags: ['Users'],
    summary: 'Renew Session Token (Refresh Token)',
    security: [
      {
        cookieAuth: [],
      },
    ],
    response: {
      200: refreshResponseSchema,
      401: unauthorizedErrorSchema,
    },
  },
  handler: refresh,
}

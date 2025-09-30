import { create } from '../create'
import {
  createBarberShopBodySchema,
  successResponseSchema,
  unauthorizedSchema,
} from '../schemas/create.schema'

export const createRoute = {
  method: 'POST',
  url: '/barberShops',
  schema: {
    description: 'Create a new Barber Shop',
    tags: ['Barber Shops'],
    security: [
      {
        bearerAuth: [],
      },
    ],
    body: createBarberShopBodySchema,
    response: {
      201: successResponseSchema,
      401: unauthorizedSchema,
    },
  },
  handler: create,
}

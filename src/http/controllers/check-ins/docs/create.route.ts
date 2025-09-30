import { create } from '../create'
import {
  badRequestErrorSchema,
  createCheckInBodySchema,
  createCheckInParamsSchema,
  notFoundErrorSchema,
  successResponseSchema,
  unauthorizedErrorSchema,
} from '../schemas/create.schema'

export const createRoute = {
  method: 'POST',
  url: '/barberShops/:barberShopId/:barberId/:haircutId/check-ins',
  schema: {
    description: 'Create a Check-In (Requires JWT and location data)',
    tags: ['Barber Shops'],
    security: [
      {
        bearerAuth: [],
      },
    ],
    params: createCheckInParamsSchema,
    body: createCheckInBodySchema,
    response: {
      201: successResponseSchema,
      400: badRequestErrorSchema,
      404: notFoundErrorSchema,
      401: unauthorizedErrorSchema,
    },
  },
  handler: create,
}

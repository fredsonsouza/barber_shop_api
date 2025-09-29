import { create } from '../create'
import {
  createHaircutBodySchema,
  errorResponseSchema,
  successResponseSchema,
  unauthorizedSchema,
} from '../schemas/create.schema'

export const createRoute = {
  method: 'POST',
  url: '/haircuts',
  schema: {
    description: 'Create a new Haircut',
    tags: ['Haircuts'],
    security: [
      {
        bearerAuth: [],
      },
    ],
    body: createHaircutBodySchema,
    response: {
      201: successResponseSchema,
      401: unauthorizedSchema,
      409: errorResponseSchema,
    },
  },
  handler: create,
}

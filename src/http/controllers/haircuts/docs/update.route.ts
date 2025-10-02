import {
  successResponseSchema,
  unauthorizedSchema,
  updateHaircutBodySchema,
  updateHaircutParamsSchema,
} from '../schemas/update.schema'
import { update } from '../update'

export const updateRoute = {
  method: 'PUT',
  url: '/haircuts/:id',
  schema: {
    description: 'Update a Haircut',
    tags: ['Haircuts'],
    summary: 'Update a haircut',
    security: [
      {
        bearerAuth: [],
      },
    ],
    params: updateHaircutParamsSchema,
    body: updateHaircutBodySchema,
    response: {
      204: successResponseSchema,
      409: unauthorizedSchema,
    },
  },
  handler: update,
}

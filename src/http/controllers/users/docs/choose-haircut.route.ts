import { choose } from '../choose-haircut'
import {
  chooseHaircutParamsSchema,
  chooseHaircutResponse,
  errorBodySchema,
  notFoundErrorSchema,
} from '../schemas/choose-haircut.schema'

export const chooseHaircutRoute = {
  method: 'POST',
  url: '/users/favorites/:haircutId/toggle',
  schema: {
    description: 'Customer choose a favorite haircut.',
    tags: ['Users'],
    summary: 'Toggle Favorite haircut.',
    security: [
      {
        bearerAuth: [],
      },
    ],
    params: chooseHaircutParamsSchema,
    response: {
      200: chooseHaircutResponse,
      404: notFoundErrorSchema,
    },
  },
  handler: choose,
}

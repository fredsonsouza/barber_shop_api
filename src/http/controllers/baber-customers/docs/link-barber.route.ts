import { link } from '../link-barber'
import {
  badRequestErrorSchema,
  linkBodySchema,
  linkResponseSchema,
} from '../schemas/link-barber.schema'

export const linkRoute = {
  method: 'POST',
  url: '/barber-customers/link',
  schema: {
    description:
      'Associates a user with the Customer role with a user with the Barber role.',
    tags: ['Barber Customers'],
    summary: 'Create Client-Barber Association',
    security: [
      {
        bearerAuth: [],
      },
    ],
    body: linkBodySchema,
    response: {
      201: linkResponseSchema,
      400: badRequestErrorSchema,
    },
  },
  handler: link,
}

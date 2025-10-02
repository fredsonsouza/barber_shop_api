import {
  notFoundErrorSchema,
  successResponseSchema,
  unauthorizedErrorSchema,
  unprocessableRequestErrorSchema,
  validateCheckInParamsSchema,
} from '../schemas/validate.schema'
import { validate } from '../validate'

export const validateRoute = {
  method: 'PATCH',
  url: '/check-ins/:checkInId/validate',
  schema: {
    description: 'Validate a Check-In (Requires JWT Token)',
    tags: ['Check-Ins'],
    summary: 'Validates a check-in',
    security: [
      {
        bearerAuth: [],
      },
    ],
    params: validateCheckInParamsSchema,
    response: {
      204: successResponseSchema,
      404: notFoundErrorSchema,
      422: unprocessableRequestErrorSchema,
      401: unauthorizedErrorSchema,
    },
  },
  handler: validate,
}

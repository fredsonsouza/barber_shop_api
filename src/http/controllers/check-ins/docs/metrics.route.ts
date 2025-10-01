import { metrics } from '../metrics'
import {
  metricsResponseSchema,
  unauthorizedErrorSchema,
} from '../schemas/metrics.schema'

export const metricsRoute = {
  method: 'GET',
  url: '/check-ins/customer-metrics',
  schema: {
    description:
      'Get customer usage statistics (check-ins count, total spent, and favorite haircut).',
    tags: ['Check-Ins'],
    summary: 'Get logged in customer metrics.',
    security: [
      {
        bearerAuth: [],
      },
    ],
    response: {
      200: metricsResponseSchema,
      401: unauthorizedErrorSchema,
    },
  },
  handler: metrics,
}

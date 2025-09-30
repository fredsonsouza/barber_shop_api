import { FastifyInstance } from 'fastify'
import { validate } from './validate'
import { metrics } from './metrics'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { createRoute } from './docs/create.route'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.route({ ...createRoute, onRequest: [verifyUserRole('CUSTOMER')] })

  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )
  app.get('/check-ins/metrics', metrics)
}

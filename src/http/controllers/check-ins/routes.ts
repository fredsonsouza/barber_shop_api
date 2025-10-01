import { validate } from './validate'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { createRoute } from './docs/create.route'
import { metricsRoute } from './docs/metrics.route'
import { FastifyTypeInstance } from '@/plugins/types'

export async function checkInsRoutes(app: FastifyTypeInstance) {
  app.addHook('onRequest', verifyJWT)
  app.route({ ...createRoute, onRequest: [verifyUserRole('CUSTOMER')] })

  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )
  app.route({ ...metricsRoute, onRequest: [verifyJWT] })
}

import { validate } from './validate'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { createRoute } from './docs/create.route'
import { metricsRoute } from './docs/metrics.route'
import { FastifyTypeInstance } from '@/plugins/types'
import { validateRoute } from './docs/validate.route'

export async function checkInsRoutes(app: FastifyTypeInstance) {
  app.addHook('onRequest', verifyJWT)
  app.route({ ...createRoute, onRequest: [verifyUserRole('CUSTOMER')] })

  app.route({ ...validateRoute, onRequest: [verifyUserRole('ADMIN')] })
  app.route(metricsRoute)
}

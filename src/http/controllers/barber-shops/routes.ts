import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { createRoute } from './docs/create.route'
import { FastifyTypeInstance } from '@/plugins/types'

export async function barberShopsRoutes(app: FastifyTypeInstance) {
  app.addHook('onRequest', verifyJWT)
  app.route({ ...createRoute, onRequest: [verifyUserRole('ADMIN')] })
}

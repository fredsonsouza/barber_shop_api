import { createRoute } from './docs/create.route'
import { FastifyTypeInstance } from '@/plugins/types'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { updateRoute } from './docs/update.route'

export async function haircutsRoutes(app: FastifyTypeInstance) {
  app.route({ ...createRoute, onRequest: [verifyJWT, verifyUserRole('ADMIN')] })
  app.route({ ...updateRoute, onRequest: [verifyJWT, verifyUserRole('ADMIN')] })
}

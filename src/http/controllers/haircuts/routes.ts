import { update } from './update'
import { createRoute } from './docs/create.route'
import { FastifyTypeInstance } from '@/plugins/types'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function haircutsRoutes(app: FastifyTypeInstance) {
  app.route({ ...createRoute, onRequest: [verifyJWT, verifyUserRole('ADMIN')] })

  app.put('/haircuts/:id', update)
}

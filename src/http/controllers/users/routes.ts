import { choose } from './choose-haircut'
import { authenticate } from './authenticate'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { refresh } from './refresh'
import { FastifyTypeInstance } from '@/plugins/types'
import { registerRoute } from './docs/register.route'
import { profileRoute } from './docs/profile.route'

export async function userRoutes(app: FastifyTypeInstance) {
  app.route(registerRoute)
  app.route({ ...profileRoute, onRequest: [verifyJWT] })

  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  app.post(
    '/users/favorites/:haircutId/toggle',
    { onRequest: [verifyJWT] },
    choose,
  )
}

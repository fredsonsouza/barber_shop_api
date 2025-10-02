import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { refresh } from './refresh'
import { FastifyTypeInstance } from '@/plugins/types'
import { registerRoute } from './docs/register.route'
import { profileRoute } from './docs/profile.route'
import { authenticateRoute } from './docs/authenticate.route'
import { chooseHaircutRoute } from './docs/choose-haircut.route'

export async function userRoutes(app: FastifyTypeInstance) {
  app.route(registerRoute)

  app.route({ ...profileRoute, onRequest: [verifyJWT] })

  app.route(authenticateRoute)

  app.patch('/token/refresh', refresh)

  app.route({ ...chooseHaircutRoute, onRequest: [verifyJWT] })
}

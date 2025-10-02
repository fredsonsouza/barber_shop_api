import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyTypeInstance } from '@/plugins/types'
import { registerRoute } from './docs/register.route'
import { profileRoute } from './docs/profile.route'
import { authenticateRoute } from './docs/authenticate.route'
import { chooseHaircutRoute } from './docs/choose-haircut.route'
import { refreshRoute } from './docs/refresh.route'

export async function userRoutes(app: FastifyTypeInstance) {
  app.route(registerRoute)

  app.route({ ...profileRoute, onRequest: [verifyJWT] })

  app.route(authenticateRoute)

  app.route(refreshRoute)

  app.route({ ...chooseHaircutRoute, onRequest: [verifyJWT] })
}

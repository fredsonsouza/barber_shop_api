import { FastifyInstance } from 'fastify'
import { register } from './register'
import { choose } from './choose-haircut'
import { profile } from './profile'
import { authenticate } from './authenticate'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { refresh } from './refresh'
import { registerDoc } from './docs/register.doc'

export async function userRoutes(app: FastifyInstance) {
  app.route(registerDoc)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  app.post(
    '/users/favorites/:haircutId/toggle',
    { onRequest: [verifyJWT] },
    choose,
  )

  app.get('/me', { onRequest: [verifyJWT] }, profile)
}

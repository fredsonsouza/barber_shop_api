import { FastifyInstance } from 'fastify'
import { register } from './register'
import { choose } from './choose-haircut'
import { profile } from './profile'
import { authenticate } from './authenticate'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { refresh } from './refresh'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  app.post(
    '/users/favorites/:haircutId/toggle',
    { onRequest: [verifyJWT] },
    choose,
  )

  app.get('/me', { onRequest: [verifyJWT] }, profile)
}

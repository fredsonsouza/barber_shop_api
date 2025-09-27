import { FastifyInstance } from 'fastify'
import { register } from './register'
import { choose } from './choose-haircut'
import { profile } from './profile'
import { authenticate } from './authenticate'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.post('/users/:userId/favorites/:haircutId/toggle', choose)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
}

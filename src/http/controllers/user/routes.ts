import { FastifyInstance } from 'fastify'
import { register } from './register'
import { choose } from './choose-haircut'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/users/:userId/favorites/:haircutId/toggle', choose)
}

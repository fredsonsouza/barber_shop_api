import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function barberShopsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.post('/barberShops', { onRequest: [verifyUserRole('ADMIN')] }, create)
}

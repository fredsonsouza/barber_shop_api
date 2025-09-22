import { FastifyInstance } from 'fastify'
import { create } from './create'

export async function barberShopsRoutes(app: FastifyInstance) {
  app.post('/barberShops', create)
}

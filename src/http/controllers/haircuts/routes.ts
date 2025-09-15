import { FastifyInstance } from 'fastify'
import { create } from './create'

export async function haircutsRoutes(app: FastifyInstance) {
  app.post('/haircuts', create)
}

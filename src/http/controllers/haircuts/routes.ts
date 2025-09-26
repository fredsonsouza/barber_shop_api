import { FastifyInstance } from 'fastify'
import { create } from './create'
import { update } from './update'

export async function haircutsRoutes(app: FastifyInstance) {
  app.post('/haircuts', create)

  app.put('/haircuts/:id', update)
}

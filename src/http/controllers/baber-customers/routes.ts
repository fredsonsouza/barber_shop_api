import { FastifyInstance } from 'fastify'
import { link } from './link-barber'

export async function barberCustomersRoutes(app: FastifyInstance) {
  app.post('/barber-customers/link', link)
}

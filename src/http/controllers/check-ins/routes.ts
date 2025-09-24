import { FastifyInstance } from 'fastify'
import { create } from './create'

export async function checkInsRoutes(app: FastifyInstance) {
  app.post(
    '/barberShops/:barberShopId/:userId/:barberId/:haircutId/check-ins',
    create,
  )
}

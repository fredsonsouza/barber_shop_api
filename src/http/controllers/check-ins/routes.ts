import { FastifyInstance } from 'fastify'
import { create } from './create'
import { validate } from './validate'

export async function checkInsRoutes(app: FastifyInstance) {
  app.post(
    '/barberShops/:barberShopId/:userId/:barberId/:haircutId/check-ins',
    create,
  )

  app.patch('/check-ins/:checkInId/validate', validate)
}

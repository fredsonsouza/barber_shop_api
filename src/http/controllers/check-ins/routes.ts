import { FastifyInstance } from 'fastify'
import { create } from './create'
import { validate } from './validate'
import { metrics } from './metrics'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function checkInsRoutes(app: FastifyInstance) {
  app.post(
    '/barberShops/:barberShopId/:barberId/:haircutId/check-ins',
    { onRequest: [verifyJWT] },
    create,
  )

  app.patch('/check-ins/:checkInId/validate', validate)
  app.get('/check-ins/metrics', { onRequest: [verifyJWT] }, metrics)
}

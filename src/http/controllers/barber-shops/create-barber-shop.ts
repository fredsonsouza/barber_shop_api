import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { makeCreateBarberShopUseCase } from '@/use-cases/factories/make-create-barber-shop-use-case'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function createBarberShop(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/barber-shops',
    {
      preHandler: [verifyJWT, verifyUserRole('ADMIN')],
      schema: {
        tags: ['barber shops'],
        summary: 'Create a barber shop',
        description: 'Create a new Barber Shop',
        security: [{ bearerAuth: [] }],
        body: z.object({
          title: z.string().min(1),
          phone: z.string().nullable(),
          latitude: z.number().refine((value) => {
            return Math.abs(value) <= 90
          }),
          longitude: z.number().refine((value) => {
            return Math.abs(value) <= 100
          }),
        }),
        response: {
          201: z.null(),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { title, phone, latitude, longitude } = request.body

      const createBarberShopUseCase = makeCreateBarberShopUseCase()

      await createBarberShopUseCase.execute({
        title,
        phone,
        latitude,
        longitude,
      })
      return reply.status(201).send()
    },
  )
}

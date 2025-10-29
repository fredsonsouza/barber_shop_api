import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { FastifyInstance } from 'fastify'
import {
  createCheckInBodySchema,
  createCheckInParamsSchema,
} from '../../schemas/check-ins/create.schema'
import { ResourceNotFoundError } from '@/use-cases/error/resource-not-found-error'
import { MaxDistanceError } from '@/use-cases/error/max-distance-error'
import { MaxNumberCheckInsError } from '@/use-cases/error/max-number-of-check-ins-error'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import z from 'zod'

export async function createCheckIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/barberShops/:barberShopId/:barberId/:haircutId/check-ins',
    {
      preHandler: [verifyJWT, verifyUserRole('CUSTOMER')],
      schema: {
        tags: ['barber shops'],
        summary: 'Create a check-in',
        description: 'Create a Check-In (Requires JWT and location data)',
        security: [
          {
            bearerAuth: [],
          },
        ],
        params: createCheckInParamsSchema,
        body: createCheckInBodySchema,
        response: {
          201: z.object({
            checkIn: z.object({
              id: z.uuid(),
              user_id: z.uuid(),
              barber_id: z.uuid(),
              haircut_id: z.uuid(),
              price: z.coerce.number(),
              barber_shop_id: z.uuid(),
            }),
          }),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          401: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const params = createCheckInParamsSchema.parse(request.params)
      const body = createCheckInBodySchema.parse(request.body)

      try {
        const checkInUseCase = makeCheckInUseCase()

        const { checkIn } = await checkInUseCase.execute({
          barberShopId: params.barberShopId,
          barberId: params.barberId,
          userId: request.user.sub,
          haircutId: params.haircutId,
          userLatitude: body.latitude,
          userLongitude: body.longitude,
        })

        return reply.status(201).send({ checkIn })
      } catch (err: any) {
        if (err instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: err.message })
        }

        if (
          err instanceof MaxDistanceError ||
          err instanceof MaxNumberCheckInsError
        ) {
          return reply.status(400).send({ message: err.message })
        }
        throw err
      }
    },
  )
}

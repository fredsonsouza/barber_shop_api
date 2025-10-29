import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { makeGetUserCustomerMetricsUseCase } from '@/use-cases/factories/make-get-customer-metrics-use-case'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function getCustomermetrics(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/check-ins/customer-metrics',
    {
      preHandler: [verifyJWT],
      schema: {
        tags: ['check-ins'],
        summary: 'Get logged in customer metrics.',
        description:
          'Get customer usage statistics (check-ins count, total spent, and favorite haircut).',
        security: [
          {
            bearerAuth: [],
          },
        ],
        response: {
          200: z.object({
            checkInsCount: z.number().int(),
            totalSpent: z.number(),
            favoriteHaircut: z
              .object({
                haircutId: z.uuid(),
                haircutName: z.string(),
                barberId: z.uuid(),
                barberName: z.string(),
                count: z.number().int().positive(),
              })
              .nullable(),
          }),
          401: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const getCustomerMetricsUseCase = makeGetUserCustomerMetricsUseCase()

      const { checkInsCount, totalSpent, favoriteHaircut } =
        await getCustomerMetricsUseCase.execute({
          userCustomerId: request.user.sub,
        })

      return reply.status(200).send({
        checkInsCount,
        totalSpent,
        favoriteHaircut,
      })
    },
  )
}

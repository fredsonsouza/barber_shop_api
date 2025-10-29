import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { makeGetUserBarberMetricsUseCase } from '@/use-cases/factories/make-get-barber-metrics-use-case'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function getBarberMetrics(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/check-ins/barber-metrics',
    {
      preHandler: [verifyJWT],
      schema: {
        tags: ['check-ins'],
        summary: 'Get logged in barber metrics.',
        description:
          'Get barber usage statistics (check-ins count, total spent, and favorite haircut).',
        security: [
          {
            bearerAuth: [],
          },
        ],
        response: {
          200: z.object({
            totalCheckIns: z.number().int(),
            totalRevenue: z.number(),
            mostFrequentCustomer: z
              .object({
                customerId: z.uuid(),
                customerName: z.string(),
                count: z.number().int(),
              })
              .nullable(),
            mostFrequentHaircut: z
              .object({
                haircutId: z.uuid(),
                haircutName: z.string(),
                count: z.number().int(),
              })
              .nullable(),
          }),
          401: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const getBarberMetricsUseCase = makeGetUserBarberMetricsUseCase()

      const {
        totalCheckIns,
        totalRevenue,
        mostFrequentCustomer,
        mostFrequentHaircut,
      } = await getBarberMetricsUseCase.execute({
        barberId: request.user.sub,
      })

      return reply.status(200).send({
        totalCheckIns,
        totalRevenue,
        mostFrequentCustomer,
        mostFrequentHaircut,
      })
    },
  )
}

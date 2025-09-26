import { makeGetUserCustomerMetricsUseCase } from '@/use-cases/factories/make-get-user-customer-metrics-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getCustomerMetricsParamsSchema = z.object({
    userCustomerId: z.uuid(),
  })

  const { userCustomerId } = getCustomerMetricsParamsSchema.parse(
    request.params,
  )

  const getCustomerMetricsUseCase = makeGetUserCustomerMetricsUseCase()

  const { checkInsCount, totalSpent, favoriteHaircut } =
    await getCustomerMetricsUseCase.execute({
      userCustomerId,
    })

  return reply.status(200).send({
    checkInsCount,
    totalSpent,
    favoriteHaircut,
  })
}

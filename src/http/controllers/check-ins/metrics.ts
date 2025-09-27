import { makeGetUserCustomerMetricsUseCase } from '@/use-cases/factories/make-get-user-customer-metrics-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
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
}

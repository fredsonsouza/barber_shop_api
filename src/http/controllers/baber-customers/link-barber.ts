import { makeLinkCustomerToBarberUseCase } from '@/use-cases/factories/make-link-customer-tobarber-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function link(request: FastifyRequest, reply: FastifyReply) {
  const linkBodySchema = z.object({
    userAsCustomerId: z.uuid(),
    userAsBarberId: z.uuid(),
  })

  const { userAsCustomerId, userAsBarberId } = linkBodySchema.parse(
    request.body,
  )

  try {
    const linkCustomerToBarberUseCase = makeLinkCustomerToBarberUseCase()

    const { link } = await linkCustomerToBarberUseCase.execute({
      userAsCustomerId,
      userAsBarberId,
    })
    return reply.status(201).send({ link })
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(400).send({ message: err.message })
    }
    return reply.status(500).send()
  }
}

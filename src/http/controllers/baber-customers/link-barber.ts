import { makeLinkCustomerToBarberUseCase } from '@/use-cases/factories/make-link-customer-tobarber-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { linkBodySchema } from './schemas/link-barber.schema'
import { DuplicateLinkCustomerToBarberError } from '@/use-cases/error/duplicate-link-customer-to-barber-error'
import { InvalidUserRoleError } from '@/use-cases/error/invalid-user-role-error'

export async function link(request: FastifyRequest, reply: FastifyReply) {
  const body = linkBodySchema.parse(request.body)

  try {
    const linkCustomerToBarberUseCase = makeLinkCustomerToBarberUseCase()

    const { link } = await linkCustomerToBarberUseCase.execute({
      userAsCustomerId: body.userAsCustomerId,
      userAsBarberId: body.userAsBarberId,
    })
    return reply.status(201).send({ link })
  } catch (err) {
    if (
      err instanceof DuplicateLinkCustomerToBarberError ||
      err instanceof InvalidUserRoleError
    ) {
      return reply.status(400).send({ message: err.message })
    }
    console.error(err)
  }
}

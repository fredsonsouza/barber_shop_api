import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
  createCheckInBodySchema,
  createCheckInParamsSchema,
} from './schemas/create.schema'
import { ResourceNotFoundError } from '@/use-cases/error/resource-not-found-error'
import { MaxDistanceError } from '@/use-cases/error/max-distance-error'
import { MaxNumberCheckInsError } from '@/use-cases/error/max-number-of-check-ins-error'

export async function create(request: FastifyRequest, reply: FastifyReply) {
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
    console.error(err)
  }
}

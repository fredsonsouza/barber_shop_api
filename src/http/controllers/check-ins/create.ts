import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    userId: z.uuid(),
    barberId: z.uuid(),
    barberShopId: z.uuid(),
    haircutId: z.uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 100
    }),
  })
  const { barberShopId, userId, barberId, haircutId } =
    createCheckInParamsSchema.parse(request.params)

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)
  try {
    const checkInUseCase = makeCheckInUseCase()

    const { checkIn } = await checkInUseCase.execute({
      barberShopId,
      barberId,
      userId,
      haircutId,
      userLatitude: latitude,
      userLongitude: longitude,
    })

    return reply.status(201).send({ checkIn })
  } catch (err: any) {
    return reply.status(400).send({ message: err.message })
  }
}

import { makeCreateBarberShopUseCase } from '@/use-cases/factories/make-create-barber-shop-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBarberShopBodySchema = z.object({
    title: z.string(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 100
    }),
  })

  const { title, phone, latitude, longitude } =
    createBarberShopBodySchema.parse(request.body)
  try {
    const createBarberShopUseCase = makeCreateBarberShopUseCase()

    await createBarberShopUseCase.execute({
      title,
      phone,
      latitude,
      longitude,
    })
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500)
  }
  return reply.status(201).send()
}

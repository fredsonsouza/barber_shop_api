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

  const createBarberShopUseCase = makeCreateBarberShopUseCase()

  await createBarberShopUseCase.execute({
    title,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}

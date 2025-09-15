import { MakeCreateHaircutUseCase } from '@/use-cases/factories/make-create-haircut-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createHaircutBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
  })

  const { name, description, price } = createHaircutBodySchema.parse(
    request.body,
  )
  const createHaircutUseCase = MakeCreateHaircutUseCase()

  await createHaircutUseCase.execute({
    name,
    description,
    price,
  })

  return reply.status(201).send()
}

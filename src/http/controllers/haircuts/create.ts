import { HaircutAlreadyExistsError } from '@/use-cases/error/haircut-already-exists-error'
import { MakeCreateHaircutUseCase } from '@/use-cases/factories/make-create-haircut-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createHaircutBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.coerce.number(),
  })

  const { name, description, price } = createHaircutBodySchema.parse(
    request.body,
  )

  try {
    const createHaircutUseCase = MakeCreateHaircutUseCase()

    await createHaircutUseCase.execute({
      name,
      description,
      price,
    })
  } catch (err) {
    if (err instanceof HaircutAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500)
  }

  return reply.status(201).send()
}

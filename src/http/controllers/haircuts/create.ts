import { HaircutAlreadyExistsError } from '@/use-cases/error/haircut-already-exists-error'
import { MakeCreateHaircutUseCase } from '@/use-cases/factories/make-create-haircut-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { createHaircutBodySchema } from './schemas/create.schema'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = createHaircutBodySchema.parse(request.body)

  try {
    const createHaircutUseCase = MakeCreateHaircutUseCase()

    await createHaircutUseCase.execute({
      name: body.name,
      description: body.description,
      price: body.price,
    })
  } catch (err) {
    if (err instanceof HaircutAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500)
  }

  return reply.status(201).send()
}

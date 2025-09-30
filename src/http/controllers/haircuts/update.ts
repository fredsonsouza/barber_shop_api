import { makeUpdateHaircutUseCase } from '@/use-cases/factories/make-update-haircut-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
  updateHaircutBodySchema,
  updateHaircutParamsSchema,
} from './schemas/update.schema'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const params = updateHaircutParamsSchema.parse(request.params)
  const body = updateHaircutBodySchema.parse(request.body)

  const updateHaircutUseCase = makeUpdateHaircutUseCase()

  await updateHaircutUseCase.execute({
    id: params.id,
    name: body.name,
    price: body.price,
    description: body.description,
  })

  reply.status(204).send()
}

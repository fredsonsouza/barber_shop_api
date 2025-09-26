import { makeUpdateHaircutUseCase } from '@/use-cases/factories/make-update-haircut-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateHaircutSchemaParams = z.object({
    id: z.uuid(),
  })

  const updateHaircutSchemaBody = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().optional(),
  })

  const { id } = updateHaircutSchemaParams.parse(request.params)

  const { name, description, price } = updateHaircutSchemaBody.parse(
    request.body,
  )

  const updateHaircutUseCase = makeUpdateHaircutUseCase()

  await updateHaircutUseCase.execute({
    id,
    name,
    price,
    description,
  })

  reply.status(204).send()
}

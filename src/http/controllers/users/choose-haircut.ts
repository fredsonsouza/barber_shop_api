import { makeChooseFavoriteHaircutUseCase } from '@/use-cases/factories/make-choose-favorite-haircut-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function choose(request: FastifyRequest, reply: FastifyReply) {
  const createUserParamsSchema = z.object({
    haircutId: z.uuid(),
  })

  const { haircutId } = createUserParamsSchema.parse(request.params)

  const chooseFavoriteHaircutUseCase = makeChooseFavoriteHaircutUseCase()

  const { user, haircut, favorited } =
    await chooseFavoriteHaircutUseCase.execute({
      userId: request.user.sub,
      haircutId,
    })
  return reply.status(200).send({
    userId: request.user.sub,
    haircutId: haircut.id,
    favorited,
  })
}

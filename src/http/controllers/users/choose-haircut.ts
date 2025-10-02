import { makeChooseFavoriteHaircutUseCase } from '@/use-cases/factories/make-choose-favorite-haircut-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { chooseHaircutParamsSchema } from './schemas/choose-haircut.schema'
import { ResourceNotFoundError } from '@/use-cases/error/resource-not-found-error'

export async function choose(request: FastifyRequest, reply: FastifyReply) {
  const params = chooseHaircutParamsSchema.parse(request.params)

  try {
    const chooseFavoriteHaircutUseCase = makeChooseFavoriteHaircutUseCase()

    const { favorited } = await chooseFavoriteHaircutUseCase.execute({
      userId: request.user.sub,
      haircutId: params.haircutId,
    })

    return reply.status(200).send({
      userId: request.user.sub,
      haircutId: params.haircutId,
      favorited,
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    console.error(err)
  }
}

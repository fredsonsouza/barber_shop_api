import { makeChooseFavoriteHaircutUseCase } from '@/use-cases/factories/make-choose-favorite-haircut-use-case'
import { FastifyInstance } from 'fastify'
import {
  chooseHaircutParamsSchema,
  chooseHaircutResponse,
  notFoundErrorSchema,
} from '../../schemas/users/choose-haircut.schema'
import { ResourceNotFoundError } from '@/use-cases/error/resource-not-found-error'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function chooseFavoriteHaircut(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users/favorites/:haircutId/toggle',
    {
      schema: {
        description: 'Customer choose a favorite haircut.',
        tags: ['users'],
        summary: 'Toggle Favorite haircut.',
        security: [
          {
            bearerAuth: [],
          },
        ],
        params: chooseHaircutParamsSchema,
        response: {
          200: chooseHaircutResponse,
          404: notFoundErrorSchema,
        },
      },
    },
    async (request, reply) => {
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
    },
  )
}

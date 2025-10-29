import { FastifyInstance } from 'fastify'

import { ResourceNotFoundError } from '@/use-cases/error/resource-not-found-error'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { toggleHaircutParamsSchema } from '@/http/schemas/users/toggle-favorite-haircut.schema'
import z from 'zod'
import { makeToggleFavoriteHaircutUseCase } from '@/use-cases/factories/make-toggle-favorite-haircut-use-case'

export async function toggleFavoriteHaircut(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users/favorites/:haircutId/toggle',
    {
      schema: {
        description: 'Customer toggle a favorite haircut.',
        tags: ['users'],
        summary: 'Toggle Favorite haircut.',
        security: [
          {
            bearerAuth: [],
          },
        ],
        params: toggleHaircutParamsSchema,
        response: {
          200: z.object({
            userId: z.uuid(),
            haircutId: z.uuid(),
            favorited: z.boolean(),
          }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const params = toggleHaircutParamsSchema.parse(request.params)

      try {
        const toggleFavoriteHaircutUseCase = makeToggleFavoriteHaircutUseCase()

        const { favorited } = await toggleFavoriteHaircutUseCase.execute({
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

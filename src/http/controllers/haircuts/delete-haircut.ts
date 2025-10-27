import z from 'zod'
import type { FastifyInstance } from 'fastify/types/instance'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { MakeDeleteHaircutUseCase } from '@/use-cases/factories/make-delete-haircut-use-case'
import { HaircutNotFoundError } from '@/use-cases/error/haircut-not-found-error'
import { InvalidCredentialsError } from '@/use-cases/error/invalid-credentials-error'

const deleteHaircutParamsSchema = z.object({
  id: z.uuid(),
})

export async function deleteHaircut(app: FastifyInstance) {
  app.delete(
    '/haircuts/:id',
    {
      preHandler: [verifyJWT, verifyUserRole('ADMIN')],

      schema: {
        tags: ['Haircuts'],
        summary: 'Delete a haircut',
        description: 'Delete an existing haircut by ID',
        security: [{ bearerAuth: [] }],
        params: z.any(),

        response: {
          204: z.object({
            message: z.string(),
          }),

          404: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },

    async (request, reply) => {
      try {
        const { id } = deleteHaircutParamsSchema.parse(request.params)

        const deleteHaircutUseCase = MakeDeleteHaircutUseCase()

        await deleteHaircutUseCase.execute({
          haircutId: id,
        })

        return reply.status(204).send()
      } catch (err) {
        if (err instanceof HaircutNotFoundError) {
          return reply.status(404).send({ message: err.message })
        }
        if (err instanceof InvalidCredentialsError) {
          return reply.status(401).send({ message: err.message })
        }
        throw err
      }
    },
  )
}

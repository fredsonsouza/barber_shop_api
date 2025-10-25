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
      onRequest: [verifyJWT, verifyUserRole('ADMIN')],
      validatorCompiler: undefined,
      serializerCompiler: undefined,
      schema: {
        tags: ['haircuts'],
        summary: 'Delete a haircut',
        description: 'Delete an existing haircut by ID',
        security: [{ bearerAuth: [] }],
        params: deleteHaircutParamsSchema,

        response: {
          204: {
            description: 'Success: No Content',
          },
          400: {
            description: 'Bad Request',
            type: 'object',
            properties: { message: { type: 'string' } },
          },
          401: {
            description: 'Unauthorized',
            type: 'object',
            properties: { message: { type: 'string' } },
          },
          404: {
            description: 'Not Found',
            type: 'object',
            properties: { message: { type: 'string' } },
          },
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
        if (err instanceof z.ZodError) {
          return reply.status(400).send({ message: 'Invalid ID format.' })
        }
        if (err instanceof HaircutNotFoundError) {
          return reply.status(404).send({ message: err.message })
        }
        if (err instanceof InvalidCredentialsError) {
          return reply.status(401).send({ message: err.message })
        }
      }
    },
  )
}

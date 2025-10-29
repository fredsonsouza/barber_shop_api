import { makeValidationCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { FastifyInstance } from 'fastify'
import { validateCheckInParamsSchema } from '../../schemas/check-ins/validate.schema'
import { ResourceNotFoundError } from '@/use-cases/error/resource-not-found-error'
import { LateCheckInValidationError } from '@/use-cases/error/late-check-in-validation-error'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import z from 'zod'

export async function validateCheckIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/check-ins/:checkInId/validate',
    {
      preHandler: [verifyJWT, verifyUserRole('ADMIN')],
      schema: {
        tags: ['check-ins'],
        summary: 'Validates a check-in',
        description: 'Validate a Check-In (Requires JWT Token)',
        security: [
          {
            bearerAuth: [],
          },
        ],
        params: validateCheckInParamsSchema,
        response: {
          204: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          422: z.object({ message: z.string() }),
          401: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const params = validateCheckInParamsSchema.parse(request.params)

      try {
        const validateCheckInUseCase = makeValidationCheckInUseCase()

        await validateCheckInUseCase.execute({
          checkInId: params.checkInId,
        })

        return reply.status(204).send()
      } catch (err: any) {
        if (err instanceof ResourceNotFoundError)
          return reply.status(404).send({ message: err.message })

        if (err instanceof LateCheckInValidationError) {
          return reply.status(422).send({ message: err.message })
        }
        throw err
      }
    },
  )
}

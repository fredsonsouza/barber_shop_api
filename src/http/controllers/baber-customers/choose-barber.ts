import { makeChooseBarberUseCase } from '@/use-cases/factories/make-choose-barber-use-case'
import { FastifyInstance } from 'fastify'
import { linkBodySchema } from '../../schemas/barber-customers/choose-barber.schema'
import { InvalidUserRoleError } from '@/use-cases/error/invalid-user-role-error'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { DuplicateChooseBarberError } from '@/use-cases/error/duplicate-choose-barber-error'

export async function chooseBarber(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/barber-customers/choose',
    {
      schema: {
        tags: ['Barber Customers'],
        summary: 'Create Client-Barber Association',
        security: [
          {
            bearerAuth: [],
          },
        ],
        body: linkBodySchema,
        response: {
          201: z.object({
            connection: z.object({
              userAsCustomerId: z.uuid(),
              userAsBarberId: z.uuid(),
            }),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const body = linkBodySchema.parse(request.body)

      const userAsCustomerId = request.user.sub

      try {
        const chooseBarberUseCase = makeChooseBarberUseCase()

        const { connection } = await chooseBarberUseCase.execute({
          userAsCustomerId: userAsCustomerId,
          userAsBarberId: body.userAsBarberId,
        })

        return reply.status(201).send({ connection })
      } catch (err) {
        if (
          err instanceof DuplicateChooseBarberError ||
          err instanceof InvalidUserRoleError
        ) {
          return reply.status(400).send({ message: err.message })
        }
        throw err
      }
    },
  )
}

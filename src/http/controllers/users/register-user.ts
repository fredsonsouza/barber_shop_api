import { UserAlreadyExistsError } from '@/use-cases/error/user-already-exists-error'
import { makeRegisterUserUseCase } from '@/use-cases/factories/make-register-user-use-case'
import { FastifyInstance } from 'fastify'
import { registerBodySchema } from '../../schemas/users/register-user-schema'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function registerUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['users'],
        summary: 'Register a new user',
        body: registerBodySchema,
        response: {
          201: z.null(),
          409: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const body = registerBodySchema.parse(request.body)

      const { name, email, password, sex, phone, birth_date } = body

      try {
        const registerUseCase = makeRegisterUserUseCase()

        await registerUseCase.execute({
          name,
          email,
          password,
          sex,
          phone,
          birthDate: birth_date,
        })
        return reply.status(201).send()
      } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
          return reply.status(409).send({ message: err.message })
        }

        throw err
      }
    },
  )
}

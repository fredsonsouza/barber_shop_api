import { InvalidCredentialsError } from '@/use-cases/error/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  authenticateResponseSchema,
  authenticateUserBodySchema,
  invalidCredentialsResponseSchema,
} from '../../schemas/users/authenticate.schema'
import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function authenticateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions',
    {
      schema: {
        tags: ['users'],
        summary: 'Logs in a user',
        description: 'Get authenticated user profile.',
        body: authenticateUserBodySchema,
        security: [
          {
            bearerAuth: [],
          },
        ],
        response: {
          200: authenticateResponseSchema,
          400: invalidCredentialsResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = authenticateUserBodySchema.parse(request.body)

      try {
        const authenticateUseCase = makeAuthenticateUseCase()

        const { user } = await authenticateUseCase.execute({
          email,
          password,
        })

        const token = await reply.jwtSign(
          {
            role: user.role,
          },
          {
            sign: {
              sub: user.id,
            },
          },
        )

        const refreshToken = await reply.jwtSign(
          {
            role: user.role,
          },
          {
            sign: {
              sub: user.id,
              expiresIn: '7d',
            },
          },
        )
        return reply
          .setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true,
          })
          .status(200)
          .send({ token })
      } catch (err) {
        if (err instanceof InvalidCredentialsError) {
          return reply.status(400).send({ message: err.message })
        }
        console.error(err)
      }
    },
  )
}

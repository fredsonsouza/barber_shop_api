import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  profileNotFoundSchema,
  profileResponseSchema,
  unauthorizedSchema,
} from '../../schemas/users/get-user-profile.schema'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function getUserProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/me',
    {
      preHandler: [verifyJWT],
      schema: {
        description: 'Get authenticated user profile',
        tags: ['users'],
        summary: 'Gets data from an authenticated user',
        security: [
          {
            bearerAuth: [],
          },
        ],
        response: {
          200: profileResponseSchema,
          401: unauthorizedSchema,
          404: profileNotFoundSchema,
        },
      },
    },
    async (request, reply) => {
      const getUserProfile = makeGetUserProfileUseCase()

      const { user } = await getUserProfile.execute({
        userId: request.user.sub,
      })
      return reply.status(200).send({
        user: {
          ...user,
        },
      })
    },
  )
}

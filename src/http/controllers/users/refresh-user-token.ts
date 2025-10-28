import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  refreshResponseSchema,
  unauthorizedErrorSchema,
} from '../../schemas/users/refresh.schema'

export async function refreshUserToken(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/token/refresh',
    {
      schema: {
        summary: 'Renew Session Token (Refresh Token)',
        description: 'Renews the access token (JWT) and Refresh Token ',
        tags: ['users'],
        security: [
          {
            cookieAuth: [],
          },
        ],
        response: {
          200: refreshResponseSchema,
          401: unauthorizedErrorSchema,
        },
      },
    },
    async (request, reply) => {
      await request.jwtVerify({ onlyCookie: true })

      const { role } = request.user

      const token = await reply.jwtSign(
        { role },
        {
          sign: {
            sub: request.user.sub,
          },
        },
      )

      const refreshToken = await reply.jwtSign(
        { role },
        {
          sign: {
            sub: request.user.sub,
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
    },
  )
}

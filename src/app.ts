import fastify from 'fastify'
import { haircutsRoutes } from './http/controllers/haircuts/routes'
import z, { ZodError } from 'zod'
import { env } from './env'
import { barberShopsRoutes } from './http/controllers/barber-shops/routes'
import { userRoutes } from './http/controllers/user/routes'

export const app = fastify()

app.register(haircutsRoutes)
app.register(barberShopsRoutes)
app.register(userRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: z.treeifyError(error) })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})

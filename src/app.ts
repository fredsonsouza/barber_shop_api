import { env } from './env'
import z, { ZodError } from 'zod'

import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

import { haircutsRoutes } from './http/controllers/haircuts/routes'
import { barberShopsRoutes } from './http/controllers/barber-shops/routes'
import { barberCustomersRoutes } from './http/controllers/baber-customers/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'
import { userRoutes } from './http/controllers/users/routes'
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { setupSwagger } from './config/swagger-config'

export const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// JWT
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

// Swagger
app.register(setupSwagger)

// Routes
app.register(haircutsRoutes)
app.register(barberShopsRoutes)
app.register(userRoutes)
app.register(barberCustomersRoutes)
app.register(checkInsRoutes)

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

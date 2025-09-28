import { env } from './env'
import z, { ZodError } from 'zod'

import fastify, { FastifyRequest } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

import { haircutsRoutes } from './http/controllers/haircuts/routes'
import { barberShopsRoutes } from './http/controllers/barber-shops/routes'
import { barberCustomersRoutes } from './http/controllers/baber-customers/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'
import { userRoutes } from './http/controllers/users/routes'

export const app = fastify()

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
app.register(swagger, {
  swagger: {
    info: {
      title: 'Barber Shop API',
      description: 'Documentation from API Barber Shop',
      version: '1.0.0',
    },
    host: 'localhost:3333',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
})

// Swagger UI
app.register(swaggerUi, {
  routePrefix: '/docs',
  staticCSP: true,
  transformSpecificationClone: true,
})

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

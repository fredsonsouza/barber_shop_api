import { env } from './env'
import z, { ZodError } from 'zod'

import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

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
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import { UPLOADS_FOLDER } from './config/upload'
import { createHaircut } from './http/controllers/haircuts/create-haircut'

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

app.register(fastifyMultipart, {
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
})

app.register(fastifyStatic, {
  root: UPLOADS_FOLDER,
  prefix: '/files',
})

app.register(fastifyCookie)

// Swagger
app.register(setupSwagger)

// Routes
app.register(createHaircut)
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

import { env } from './env'
import z from 'zod'

import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

import { checkInsRoutes } from './http/controllers/check-ins/routes'
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { setupSwagger } from './config/swagger-config'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import { UPLOADS_FOLDER } from './config/upload'
import { createHaircut } from './http/controllers/haircuts/create-haircut'
import { deleteHaircut } from './http/controllers/haircuts/delete-haircut'
import { updateHaircut } from './http/controllers/haircuts/update-haircut'
import { createBarberShop } from './http/controllers/barber-shops/create-barber-shop'
import { registerUser } from './http/controllers/users/register-user'
import { authenticateUser } from './http/controllers/users/authenticate-user'
import { getUserProfile } from './http/controllers/users/get-user-profile'
import { refreshUserToken } from './http/controllers/users/refresh-user-token'
import { toggleFavoriteHaircut } from './http/controllers/users/toggle-favorite-haircut'
import { chooseBarber } from './http/controllers/baber-customers/choose-barber'

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
app.register(deleteHaircut)
app.register(updateHaircut)

app.register(createBarberShop)

app.register(registerUser)
app.register(authenticateUser)
app.register(getUserProfile)
app.register(refreshUserToken)
app.register(toggleFavoriteHaircut)

app.register(chooseBarber)

app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof z.ZodError) {
    return reply
      .status(400)
      .send({ message: error.issues[0]?.message ?? 'Invalid input data.' })
  }

  if (error.code === 'FST_ERR_VALIDATION') {
    const message = error.validation?.[0]?.message ?? 'Invalid request payload.'
    return reply.status(400).send({ message })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})

import { FastifyTypeInstance } from '@/plugins/types'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'

export function _setupSwagger(app: FastifyTypeInstance) {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'API Barber Shop',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT authentication token',
          },
        },
      },
    },
    transform: jsonSchemaTransform,
    mode: 'dynamic',
  })

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformSpecification: (swaggerObject) => swaggerObject,
  })
}
export const setupSwagger = fastifyPlugin(_setupSwagger)

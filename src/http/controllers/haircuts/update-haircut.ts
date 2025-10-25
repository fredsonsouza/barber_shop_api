import { parseMultipart } from '@/http/hooks/parse-multipart'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { InvalidFileTypeError } from '@/use-cases/error/invalid-file-type-error'
import { ResourceNotFoundError } from '@/use-cases/error/resource-not-found-error'
import { makeUpdateHaircutUseCase } from '@/use-cases/factories/make-update-haircut-use-case'
import type { FastifyInstance } from 'fastify'
import { unlink } from 'node:fs/promises'
import z from 'zod'

const updateParamsSchema = z.object({
  id: z.uuid(),
})

const updateBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
})
export async function updateHaircut(app: FastifyInstance) {
  app.put(
    '/haircuts/:id',
    {
      onRequest: [verifyJWT, verifyUserRole('ADMIN')],
      preHandler: [parseMultipart],

      onResponse: async (request) => {
        if (request.multipart?.file.tempPath) {
          try {
            await unlink(request.multipart.file.tempPath)
          } catch (err) {}
        }
      },

      validatorCompiler: undefined,
      serializerCompiler: undefined,

      schema: {
        tags: ['Haircuts'],
        summary: 'Update a haircut',
        description: 'Update an existing haircut. Fields are optional.',
        security: [{ bearerAuth: [] }],
        consumes: ['multipart/form-data'],

        params: updateParamsSchema,

        requestBody: {
          description: 'Fields to update (all optional).',
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  price: { type: 'number', format: 'float' },
                  image: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },

        response: {
          200: {
            description: 'Updated haircut',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number' },
              image_url: { type: 'string', nullable: true },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
          400: {
            description: 'Bad Request',
            type: 'object',
            properties: { message: { type: 'string' } },
          },
          401: {
            description: 'Unauthorized',
            type: 'object',
            properties: { message: { type: 'string' } },
          },
          404: {
            description: 'Not Found',
            type: 'object',
            properties: { message: { type: 'string' } },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = updateParamsSchema.parse(request.params)

        const body = updateBodySchema.parse(request.multipart.body)

        const { file } = request.multipart

        const updateHaircutUseCase = makeUpdateHaircutUseCase()

        const { updatedHaircut } = await updateHaircutUseCase.execute({
          id,
          name: body.name,
          description: body.description,
          price: body.price,
          imageTempFileName: file.filename ?? undefined,
          imageMimeType: file.mimetype ?? undefined,
        })

        return reply.status(200).send(updatedHaircut)
      } catch (err) {
        if (err instanceof z.ZodError) {
          return reply
            .status(400)
            .send({ message: 'Validation error.', issues: err.format() })
        }
        if (err instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: err.message })
        }
        if (err instanceof InvalidFileTypeError) {
          return reply.status(400).send({ message: err.message })
        }
      }
    },
  )
}

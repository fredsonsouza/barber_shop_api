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
      preHandler: [parseMultipart, verifyJWT, verifyUserRole('ADMIN')],

      onResponse: async (request) => {
        if (request.multipart?.file.tempPath) {
          try {
            await unlink(request.multipart.file.tempPath)
          } catch (err) {}
        }
      },

      schema: {
        tags: ['Haircuts'],
        summary: 'Update a haircut',
        description: 'Update an existing haircut. Fields are optional.',
        security: [{ bearerAuth: [] }],
        consumes: ['multipart/form-data'],
        params: z.any(),
        body: z.any(),
        response: {
          204: z.null(),
          400: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = updateParamsSchema.parse(request.params)
        const body = updateBodySchema.parse(request.multipart.body)

        const { file } = request.multipart

        const updateHaircutUseCase = makeUpdateHaircutUseCase()

        await updateHaircutUseCase.execute({
          id,
          name: body.name,
          description: body.description,
          price: body.price,
          imageTempFileName: file.filename ?? undefined,
          imageMimeType: file.mimetype ?? undefined,
        })

        return reply.status(204).send()
      } catch (err) {
        if (err instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: err.message })
        }
        if (err instanceof InvalidFileTypeError) {
          return reply.status(400).send({ message: err.message })
        }
        throw err
      }
    },
  )
}

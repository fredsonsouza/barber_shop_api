import { HaircutAlreadyExistsError } from '@/use-cases/error/haircut-already-exists-error'
import { MakeCreateHaircutUseCase } from '@/use-cases/factories/make-create-haircut-use-case'
import { InvalidFileTypeError } from '@/use-cases/error/invalid-file-type-error'
import z from 'zod'
import { parseMultipart } from '@/http/hooks/parse-multipart'
import type { FastifyInstance } from 'fastify/types/instance'
import { unlink } from 'node:fs/promises'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

const createHaircutBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
})

export async function createHaircut(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/haircuts',
    {
      preHandler: [parseMultipart],
      onResponse: async (request) => {
        if (request.multipart?.file.tempPath) {
          try {
            await unlink(request.multipart.file.tempPath)
          } catch (err) {}
        }
      },

      schema: {
        tags: ['Haircuts'],
        summary: 'Create a haircut',
        description: 'Create a new Haircut',
        security: [{ bearerAuth: [] }],
        consumes: ['multipart/form-data'],
        requestBody: createHaircutBodySchema,
        response: {
          201: z.null().describe('Haircut created'),
          400: z.object({ message: z.string(), issues: z.any().optional() }),
          409: z.object({ message: z.string() }),
          401: z.object({ message: z.string() }),
        },
      },
    },

    async (request, reply) => {
      try {
        const body = createHaircutBodySchema.parse(request.multipart.body)

        const { name, description, price } = body
        const createHaircutUseCase = MakeCreateHaircutUseCase()

        if (
          !request.multipart.file?.filename ||
          !request.multipart.file?.mimetype
        ) {
          return reply.status(400).send({ message: 'Image file is required.' })
        }

        const { filename, mimetype } = request.multipart.file

        await createHaircutUseCase.execute({
          name,
          description,
          price,
          imageTempFileName: filename,
          imageMimeType: mimetype,
        })
      } catch (err) {
        if (err instanceof HaircutAlreadyExistsError) {
          return reply.status(409).send({ message: err.message })
        }

        if (err instanceof InvalidFileTypeError) {
          return reply.status(400).send({ message: err.message })
        }
      }
      return reply.status(201).send()
    },
  )
}

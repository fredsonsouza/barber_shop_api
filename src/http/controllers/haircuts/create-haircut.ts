import { HaircutAlreadyExistsError } from '@/use-cases/error/haircut-already-exists-error'
import { InvalidFileTypeError } from '@/use-cases/error/invalid-file-type-error'
import { MakeCreateHaircutUseCase } from '@/use-cases/factories/make-create-haircut-use-case'
import { parseMultipart } from '@/http/middlewares/parse-multipart'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { unlink } from 'node:fs/promises'
import z from 'zod'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

const createHaircutBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().positive(),
})

export async function createHaircut(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/haircuts',
    {
      preHandler: [verifyJWT, verifyUserRole('ADMIN'), parseMultipart],
      onResponse: async (request) => {
        if (request.multipart?.file?.tempPath) {
          try {
            await unlink(request.multipart.file.tempPath)
          } catch {}
        }
      },
      schema: {
        tags: ['haircuts'],
        summary: 'Create a new haircut',
        security: [{ bearerAuth: [] }],
        consumes: ['multipart/form-data'],
        body: z.any(),
        response: {
          201: z.null(),
          400: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const body = createHaircutBodySchema.parse(request.multipart.body)

        if (
          !request.multipart.file?.filename ||
          !request.multipart.file?.mimetype
        ) {
          return reply.status(400).send({
            message: 'Image file is required.',
          })
        }

        const { filename, mimetype } = request.multipart.file

        const { name, description, price } = body

        const createHaircutUseCase = MakeCreateHaircutUseCase()

        await createHaircutUseCase.execute({
          name,
          description,
          price,
          imageTempFileName: filename,
          imageMimeType: mimetype,
        })

        return reply.status(201).send()
      } catch (err) {
        if (err instanceof HaircutAlreadyExistsError) {
          return reply.status(409).send({ message: err.message })
        }

        if (err instanceof InvalidFileTypeError) {
          return reply.status(400).send({ message: err.message })
        }

        throw err
      }
    },
  )
}

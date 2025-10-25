import { FastifyReply, FastifyRequest } from 'fastify'
import { HaircutAlreadyExistsError } from '@/use-cases/error/haircut-already-exists-error'
import { MakeCreateHaircutUseCase } from '@/use-cases/factories/make-create-haircut-use-case'
import { createHaircutBodySchema } from './schemas/create.schema'
import { InvalidFileTypeError } from '@/use-cases/error/invalid-file-type-error'

// Imports do Node.js para lidar com arquivos
import { pipeline } from 'node:stream/promises'
import { createWriteStream } from 'node:fs'
import { unlink } from 'node:fs/promises' // Para deletar o arquivo temp
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { ZodError } from 'zod'
import { TMP_FOLDER } from '@/config/upload'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  let imageTempFileName: string | null = null
  let imageMimeType: string | null = null
  let tempNameOnly: string | null = null
  const formData = new Map<string, string>()

  if (!request.isMultipart()) {
    return reply.status(400).send({ message: 'Request is not multipart' })
  }

  try {
    const parts = request.parts()

    for await (const part of parts) {
      if (part.type === 'file') {
        // Salva o arquivo temporariamente
        imageMimeType = part.mimetype
        tempNameOnly = `${randomUUID()}-${part.filename}`
        imageTempFileName = join(TMP_FOLDER, tempNameOnly)

        await pipeline(part.file, createWriteStream(imageTempFileName))
      } else if (part.type === 'field') {
        // Guarda os campos de texto
        formData.set(part.fieldname, part.value as string)
      }
    }

    // Valida se o arquivo foi enviado
    if (!tempNameOnly || !imageMimeType) {
      return reply.status(400).send({ message: 'Image file is required.' })
    }

    // Converte o Map para um objeto e valida com Zod
    const dataObject = Object.fromEntries(formData)
    const body = createHaircutBodySchema.parse(dataObject)

    // Executa o Use Case
    const createHaircutUseCase = MakeCreateHaircutUseCase()
    await createHaircutUseCase.execute({
      name: body.name,
      description: body.description,
      price: body.price,
      imageTempFileName: tempNameOnly, // Passa o caminho do arquivo salvo
      imageMimeType, // Passa o mime type
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return reply.status(400).send({
        message: 'Validation error.',
        issues: err.format(),
      })
    }
    if (err instanceof HaircutAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof InvalidFileTypeError) {
      return reply.status(400).send({ message: err.message })
    }

    // Log do erro desconhecido
    console.error(err)
    return reply.status(500).send({ message: 'Internal server error.' })
  } finally {
    // Limpa o arquivo temporário
    if (imageTempFileName) {
      try {
        await unlink(imageTempFileName)
      } catch (unlinkError) {
        // console.error('Error deleting temp file:', unlinkError)
      }
    }
  }

  return reply.status(201).send()
}

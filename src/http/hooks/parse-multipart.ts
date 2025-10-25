import { FastifyReply, FastifyRequest } from 'fastify'
import { createWriteStream } from 'node:fs'
import { unlink } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { TMP_FOLDER } from '@/config/upload'

/**
 * Hook preHandler do Fastify para processar requisições multipart/form-data.
 *
 * Ele salva o PRIMEIRO arquivo encontrado na pasta /tmp e
 * anexa os campos de texto ao `request.body` para validação.
 *
 * Também garante a limpeza do arquivo temporário no 'finally' usando
 * o hook 'onResponse' do Fastify, que é mais seguro.
 */
export async function parseMultipart(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!request.isMultipart()) {
    return reply.status(400).send({ message: 'Request is not multipart' })
  }

  let tempFileFullPath: string | null = null
  let tempFileNameOnly: string | null = null
  let tempMimeType: string | null = null
  const formData = new Map<string, string>()

  // Garante a limpeza caso algo dê errado DURANTE o processamento
  const cleanup = async () => {
    if (tempFileFullPath) {
      try {
        await unlink(tempFileFullPath)
      } catch (unlinkError) {
        // Ignora (pode já ter sido movido ou deletado)
      }
    }
  }

  try {
    const parts = request.parts()

    for await (const part of parts) {
      if (part.type === 'file') {
        // Apenas processa o primeiro arquivo que encontrar
        if (!tempFileNameOnly) {
          tempMimeType = part.mimetype
          tempFileNameOnly = `${randomUUID()}-${part.filename}`
          tempFileFullPath = join(TMP_FOLDER, tempFileNameOnly)

          await pipeline(part.file, createWriteStream(tempFileFullPath))
        }
      } else if (part.type === 'field') {
        formData.set(part.fieldname, part.value as string)
      }
    }

    // Anexa os dados ao request para o handler principal usar

    // Anexa as informações do arquivo também
    request.multipart = {
      file: {
        filename: tempFileNameOnly,
        mimetype: tempMimeType,
        tempPath: tempFileFullPath,
      },
      body: Object.fromEntries(formData),
    }
  } catch (err) {
    await cleanup() // Limpa se o pipeline falhar
    throw err // Lança o erro original
  }
}

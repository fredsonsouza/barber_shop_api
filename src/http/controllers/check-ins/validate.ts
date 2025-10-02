import { makeValidationCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { validateCheckInParamsSchema } from './schemas/validate.schema'
import { ResourceNotFoundError } from '@/use-cases/error/resource-not-found-error'
import { LateCheckInValidationError } from '@/use-cases/error/late-check-in-validation-error'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const params = validateCheckInParamsSchema.parse(request.params)

  try {
    const validateCheckInUseCase = makeValidationCheckInUseCase()

    await validateCheckInUseCase.execute({
      checkInId: params.checkInId,
    })

    return reply.status(204).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError)
      return reply.status(404).send({ message: err.message })

    if (err instanceof LateCheckInValidationError) {
      return reply.status(422).send({ message: err.message })
    }
    console.error(err)
  }
}

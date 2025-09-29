import { UserAlreadyExistsError } from '@/use-cases/error/user-already-exists-error'
import { makeRegisterUserUseCase } from '@/use-cases/factories/make-register-user-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { registerBodySchema } from './schemas/register.schema'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const body = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUserUseCase()

    await registerUseCase.execute({
      name: body.name,
      email: body.email,
      password: body.password,
      sex: body.sex,
      phone: body.phone,
      birthDate: body.birth_date,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
  }
  return reply.status(201).send()
}

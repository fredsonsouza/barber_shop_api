import { UserAlreadyExistsError } from '@/use-cases/error/user-already-exists-error'
import { makeRegisterUserUseCase } from '@/use-cases/factories/make-register-user-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    sex: z.string(),
    birth_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido, esperado YYYY-MM-DD')
      .transform((val) => {
        const [y, m, d] = val.split('-')
        const year = Number(y)
        const month = Number(m)
        const day = Number(d)

        return new Date(Date.UTC(year, month - 1, day))
      }),
  })

  const { name, email, password, phone, sex, birth_date } =
    registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUserUseCase()

    await registerUseCase.execute({
      name,
      email,
      password,
      phone,
      sex,
      birthDate: birth_date,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500)
  }
  return reply.status(201).send()
}

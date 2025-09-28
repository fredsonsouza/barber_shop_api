import z from 'zod'

export const registerBodySchema = z.object({
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

export const registerResponseSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'BARBER', 'CUSTOMER']),
})

export type RegisterBody = z.infer<typeof registerBodySchema>
export type RegisterResponse = z.infer<typeof registerResponseSchema>

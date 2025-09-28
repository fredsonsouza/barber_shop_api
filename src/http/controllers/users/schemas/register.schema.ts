import z from 'zod'

export const registerBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  sex: z.string(),
  birth_date: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        // Checa formato YYYY-MM-DD
        const match = /^\d{4}-\d{2}-\d{2}$/.test(val)
        if (!match) return val
        const [y, m, d] = val.split('-')
        return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)))
      }
      return val
    },
    z.date().refine((date) => !isNaN(date.getTime()), {
      message: 'Formato inválido, esperado YYYY-MM-DD',
    }),
  ),
})

export const registerResponseSchema = z.object({
  201: z.null().describe('User Created'),
})

export type RegisterBody = z.infer<typeof registerBodySchema>
export type RegisterResponse = z.infer<typeof registerResponseSchema>

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

export const successResponseSchema = z.null().describe('User Created')

export const errorResponseSchema = z
  .object({
    message: z.string().describe('Error details, ex: "User already exists!"'),
  })
  .describe('Email of already registered user')

export type RegisterBody = z.infer<typeof registerBodySchema>
export type SuccessResponse = z.infer<typeof successResponseSchema>
export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>

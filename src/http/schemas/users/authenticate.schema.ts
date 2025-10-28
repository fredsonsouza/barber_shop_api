import z from 'zod'

export const authenticateUserBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export const authenticateResponseSchema = z
  .object({
    token: z.string().describe('The primary JWT authentication token.'),
  })
  .describe(
    'Authentication successful. Primary token returned in body, Refresh Token set via HTTP-only cookie.',
  )

export const invalidCredentialsResponseSchema = z
  .object({
    message: z.string().describe('Details: Invalid credentials.'),
  })
  .describe('Unsuccessful authentication. E-mail or passoword wrong')

export type AuthenticateUserBody = z.infer<typeof authenticateUserBodySchema>
export type AuthenticateResponse = z.infer<typeof authenticateResponseSchema>

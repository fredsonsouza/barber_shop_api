import z from 'zod'

export const refreshResponseSchema = z
  .object({
    token: z.string().describe('New short-lived JWT access token'),
  })
  .describe('Success response after token renewal')

export const unauthorizedErrorSchema = z
  .object({
    message: z.string().describe('Invalid, missing, or expired Refresh Token.'),
  })
  .describe('Unauthorized')

export type RefreshResponse = z.infer<typeof refreshResponseSchema>
export type Unauthorized = z.infer<typeof unauthorizedErrorSchema>

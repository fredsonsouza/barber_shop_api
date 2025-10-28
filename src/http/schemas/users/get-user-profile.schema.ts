import z from 'zod'

export const profileUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  phone: z.string().optional().nullable(),
  sex: z.string(),
  birth_date: z.date(),
})

export const profileResponseSchema = z
  .object({
    user: profileUserSchema,
  })
  .describe('User profile data')

export const profileNotFoundSchema = z
  .object({
    message: z.string().describe('Message: User not found'),
  })
  .describe('User not found')

export const unauthorizedSchema = z
  .object({
    message: z.string().describe('Message: Unauthorized'),
  })
  .describe('User without a JWT token')

export type ProfileResponse = z.infer<typeof profileResponseSchema>
export type ProfileNotFound = z.infer<typeof profileNotFoundSchema>
export type Unauthorized = z.infer<typeof unauthorizedSchema>

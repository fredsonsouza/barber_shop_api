import z from 'zod'

export const validateCheckInParamsSchema = z.object({
  checkInId: z.uuid().describe('Checkin ID to be validated'),
})

export const successResponseSchema = z.null().describe('Check-in created')

export const errorBodySchema = z.object({
  message: z.string().describe('Error detail'),
})

export const unprocessableRequestErrorSchema = errorBodySchema.describe(
  'Unprocessable - Time limit exceeded',
)
export const notFoundErrorSchema = errorBodySchema.describe(
  'Not Found - Check-In not found.',
)
export const unauthorizedErrorSchema = z
  .object({
    message: z
      .string()
      .default('Unauthorized')
      .describe('Invalid credentials Token.'),
  })
  .describe('Unauthorized')

export type SuccessResponse = z.infer<typeof successResponseSchema>
export type ErrorBody = z.infer<typeof errorBodySchema>
export type ValidateCheckIn = z.infer<typeof validateCheckInParamsSchema>

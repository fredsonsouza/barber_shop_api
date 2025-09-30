import z from 'zod'

export const createCheckInParamsSchema = z.object({
  barberId: z.uuid(),
  barberShopId: z.uuid(),
  haircutId: z.uuid(),
})

export const createCheckInBodySchema = z.object({
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 100
  }),
})

export const successResponseSchema = z.null().describe('Check-in created')

export const errorBodySchema = z.object({
  message: z.string().describe('Error detail'),
})

export const badRequestErrorSchema = errorBodySchema.describe(
  'Invalid credentials, maximum distance exceeded, or duplicate check-in',
)
export const notFoundErrorSchema = errorBodySchema.describe(
  'Not Found - Barber, barber or haircut not found.',
)
export const unauthorizedErrorSchema = z
  .object({
    message: z
      .string()
      .default('Unauthorized')
      .describe('Token inválido ou ausente.'),
  })
  .describe('Unauthorized') // Documentação do status

export type CreateCheckInParams = z.infer<typeof createCheckInParamsSchema>
export type CreateCheckInBody = z.infer<typeof createCheckInBodySchema>
export type SuccessResponse = z.infer<typeof successResponseSchema>
export type ErrorBody = z.infer<typeof errorBodySchema>

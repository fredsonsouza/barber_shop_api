import z from 'zod'

const CheckInZodSchema = z
  .object({
    id: z.uuid().describe('Unique ID of the Check-in record.'),
    user_id: z
      .uuid()
      .describe('ID of the customer who performed the check-in.'),
    barber_id: z.uuid().describe('ID of the barber who performed the service.'),
    haircut_id: z.uuid().describe('ID of the haircut performed.'),
    price: z.coerce.number().describe('Price of the haircut service.'),
    barber_shop_id: z.uuid().describe('ID of the associated barber shop.'),
  })
  .partial()
  .describe('Check-in object created.')

export const createCheckInParamsSchema = z
  .object({
    barberId: z.uuid().describe('ID of the Barber.'),
    barberShopId: z
      .uuid()
      .describe('ID of the Barber Shop the check-in is performed at.'),
    haircutId: z.uuid().describe('ID of the Haircut service performed.'),
  })
  .describe('URL parameters required for Check-in.')

export const createCheckInBodySchema = z
  .object({
    latitude: z
      .number()
      .refine((value) => {
        return Math.abs(value) <= 90
      })
      .describe("Customer's current latitude for distance calculation."),
    longitude: z
      .number()
      .refine((value) => {
        return Math.abs(value) <= 100
      })
      .describe("Customer's current longitude for distance calculation."),
  })
  .describe("Body containing the customer's geolocation data.")

export const successResponseSchema = z
  .object({
    checkIn: CheckInZodSchema,
  })
  .describe('Check-in created successfully. Returns the CheckIn object.')

export const errorBodySchema = z
  .object({
    message: z.string().describe('Detailed error message from the server.'),
  })
  .describe('Standard error response body.')

export const badRequestErrorSchema = errorBodySchema.describe(
  'Bad Request (400) - Invalid data, maximum distance exceeded, or maximum daily check-ins exceeded.',
)
export const notFoundErrorSchema = errorBodySchema.describe(
  'Not Found (404) - Barber, Barber Shop, or Haircut resource not found.',
)
export const unauthorizedErrorSchema = z
  .object({
    message: z
      .string()
      .default('Unauthorized')
      .describe('Token inválido ou ausente.'),
  })
  .describe('Unauthorized')

export type CreateCheckInParams = z.infer<typeof createCheckInParamsSchema>
export type CreateCheckInBody = z.infer<typeof createCheckInBodySchema>
export type SuccessResponse = z.infer<typeof successResponseSchema>
export type ErrorBody = z.infer<typeof errorBodySchema>

import z from 'zod'

export const favoriteHaircutSchema = z
  .object({
    haircutId: z.uuid().describe('ID of the most popular haircut..'),
    haircutName: z.string().describe('Haircut name.'),
    barberId: z
      .uuid()
      .describe('ID of the barber who performed the most haircuts.'),
    barberName: z.string().describe('Barber name.'),
    count: z
      .number()
      .int()
      .positive()
      .describe('Total number of times the haircut was performed.'),
  })
  .nullable()
  .describe(
    'Details of the customer"s most requested haircut, or null if the customer has no check-ins.',
  )

export const metricsResponseSchema = z
  .object({
    checkInsCount: z
      .number()
      .int()
      .describe('Total number of check-ins (visits) made by the customer.'),
    totalSpent: z
      .number()
      .describe('Total amount (in R$) spent by the customer.'),
    favoriteHaircut: favoriteHaircutSchema,
  })
  .describe('Customer metrics dashboard data.')

export const unauthorizedErrorSchema = z
  .object({
    message: z
      .string()
      .default('Unauthorized')
      .describe('Invalid Token JWT or missing.'),
  })
  .describe('Unauthorized')

export type MetricsResponse = z.infer<typeof metricsResponseSchema>
export type Unauthorized = z.infer<typeof unauthorizedErrorSchema>

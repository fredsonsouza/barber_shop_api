import z from 'zod'

export const createBarberShopBodySchema = z.object({
  title: z.string(),
  phone: z.string().nullable(),
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 100
  }),
})

export const successResponseSchema = z.null().describe('Barber Shop created')

export const errorResponseSchema = z
  .object({
    message: z
      .string()
      .describe('Error details, ex: "Haircut already exists!"'),
  })
  .describe('Name of already registered haircut')

export const unauthorizedSchema = z
  .object({
    message: z.string().describe('Message: Unauthorized'),
  })
  .describe('User role verification')

export type CreateBody = z.infer<typeof createBarberShopBodySchema>
export type SuccessResponse = z.infer<typeof successResponseSchema>
export type Unauthorized = z.infer<typeof unauthorizedSchema>

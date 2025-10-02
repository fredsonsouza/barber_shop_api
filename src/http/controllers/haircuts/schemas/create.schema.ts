import z from 'zod'

export const createHaircutBodySchema = z
  .object({
    name: z.string(),
    description: z.string(),
    price: z.coerce.number(),
  })
  .describe('Haircut creation')

export const successResponseSchema = z.null().describe('Haircut created')

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

export type CreateBody = z.infer<typeof createHaircutBodySchema>
export type SuccessResponse = z.infer<typeof successResponseSchema>
export type ErrorResponse = z.infer<typeof errorResponseSchema>
export type Unauthorized = z.infer<typeof unauthorizedSchema>

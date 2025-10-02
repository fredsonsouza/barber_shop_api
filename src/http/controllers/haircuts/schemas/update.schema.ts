import z from 'zod'

export const updateHaircutParamsSchema = z.object({
  id: z.uuid(),
})

export const updateHaircutBodySchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().optional(),
  })
  .describe('Updates data for a haircut')

export const successResponseSchema = z.null().describe('Haircut updated')

export const unauthorizedSchema = z
  .object({
    message: z.string().describe('Message: Unauthorized'),
  })
  .describe('User role verification')

export type UpdateHaircutParams = z.infer<typeof updateHaircutParamsSchema>
export type UpdateHaircutBody = z.infer<typeof updateHaircutBodySchema>
export type SuccessResponse = z.infer<typeof successResponseSchema>
export type Unauthorized = z.infer<typeof unauthorizedSchema>

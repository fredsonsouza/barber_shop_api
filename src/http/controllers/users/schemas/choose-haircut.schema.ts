import z from 'zod'

export const chooseHaircutParamsSchema = z.object({
  haircutId: z.uuid().describe('Haircut ID to be favorited'),
})

export const chooseHaircutResponse = z.object({
  userId: z.uuid().describe('ID of the user who favorited the haircut'),
  haircutId: z.uuid().describe('ID of the chosen haircut'),
  favorited: z
    .boolean()
    .describe(
      'Indicates whether this haircut has been marked as a favorite by the current customer (TRUE/FALSE).',
    ),
})

export const errorBodySchema = z.object({
  message: z.string().describe('Error detail'),
})

export const notFoundErrorSchema = errorBodySchema.describe(
  'Not Found - User or haircut not found.',
)

export type ChooseHaircut = z.infer<typeof chooseHaircutParamsSchema>
export type ErrorBody = z.infer<typeof errorBodySchema>
export type ChooseResponse = z.infer<typeof chooseHaircutResponse>

import z from 'zod'

export const toggleHaircutParamsSchema = z.object({
  haircutId: z.uuid().describe('Haircut ID to be favorited'),
})

export const toggleHaircutResponse = z.object({
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

export type ToggleHaircut = z.infer<typeof toggleHaircutParamsSchema>
export type ErrorBody = z.infer<typeof errorBodySchema>
export type ToggleResponse = z.infer<typeof toggleHaircutResponse>

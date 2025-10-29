import z from 'zod'

export const linkBodySchema = z
  .object({
    userAsBarberId: z.uuid().describe('User ID to be associated as Barber'),
  })
  .describe('Data required to associate a client with a barber')

export type LinkBody = z.infer<typeof linkBodySchema>

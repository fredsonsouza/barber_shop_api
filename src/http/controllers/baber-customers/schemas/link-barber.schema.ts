import z from 'zod'

export const linkBodySchema = z
  .object({
    userAsBarberId: z.uuid().describe('User ID to be associated as Barber'),
  })
  .describe('Data required to associate a client with a barber')

export const linkResponseSchema = z
  .object({
    link: z.object({
      userAsCustomerId: z.uuid().describe('Associated Customer ID'),
      userAsBarberId: z.uuid().describe('Associated Barber ID'),
    }),
  })
  .describe('Association successfully created')

export const badRequestErrorSchema = z
  .object({
    message: z
      .string()
      .describe('Error details: "Invalid user role." or "Duplicate link."'),
  })
  .describe('Invalid Request (Incorrect User Role or Duplicate Membership).')

export type LinkBody = z.infer<typeof linkBodySchema>
export type LinkResponse = z.infer<typeof linkResponseSchema>
export type ErrorSchema = z.infer<typeof badRequestErrorSchema>

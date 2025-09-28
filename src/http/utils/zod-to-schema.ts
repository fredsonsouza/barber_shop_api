import z from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

export function toJsonSchema(schema: z.ZodType) {
  return zodToJsonSchema(schema, { $refStrategy: 'none' })
}

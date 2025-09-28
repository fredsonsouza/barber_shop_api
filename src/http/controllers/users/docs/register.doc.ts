import { registerResponseSchema } from '../schemas/register.schema'
import { register } from '../register'
import { toJsonSchema } from '@/http/utils/zod-to-schema'

export const registerDoc = {
  method: 'POST',
  url: '/users',
  schema: {
    description: 'Register a new user on system',
    tags: ['Users'],
    response: {
      201: toJsonSchema(registerResponseSchema),
      409: {
        desciption: 'User already exsists!',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  handler: register,
}

import z from 'zod'
import { register } from '../register'
import {
  registerBodySchema,
  registerResponseSchema,
} from '../schemas/register.schema'

export const registerDoc = {
  method: 'POST',
  url: '/users',
  schema: {
    description: 'Register a new user',
    tags: ['Users'],
    body: registerBodySchema,
    response: {
      201: registerResponseSchema,
    },
  },
  handler: register,
}

import { create } from '../create'
import {
  createHaircutBodySchema,
  errorResponseSchema,
  successResponseSchema,
  unauthorizedSchema,
} from '../schemas/create.schema'

export const createRoute = {
  method: 'POST',
  url: '/haircuts',
  schema: {
    description: 'Create a new Haircut',
    tags: ['Haircuts'],
    summary: 'Create a haircut',
    security: [
      {
        bearerAuth: [],
      },
    ],
    consumes: ['multipart/form-data'],
    // body: {
    //   type: 'object',
    //   required: ['name', 'description', 'price', 'image'],
    //   properties: {
    //     name: { type: 'string' },
    //     description: { type: 'string' },
    //     price: { type: 'number', format: 'float' }, // 'number' é melhor para docs
    //     image: { type: 'string', format: 'binary' }, // 'binary' indica um arquivo
    //   },
    // },
    response: {
      201: successResponseSchema,
      401: unauthorizedSchema,
      409: errorResponseSchema,
    },
  },
  handler: create,
}

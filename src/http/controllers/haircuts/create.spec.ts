import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Haircut (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('Should be able to create a haircut', async () => {
    const response = await request(app.server).post('/haircuts').send({
      name: 'Test haircut',
      description: 'Description test haircut',
      price: 20,
    })
    expect(response.statusCode).toEqual(201)
  })
})

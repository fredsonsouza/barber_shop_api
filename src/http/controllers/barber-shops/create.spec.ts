import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create a Barber Shop (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to create a Barber Shop', async () => {
    const response = await request(app.server).post('/barberShops').send({
      title: 'New Barber Shop',
      phone: '99 99999-9999',
      latitude: -23.5505,
      longitude: -46.6333,
    })

    expect(response.statusCode).toEqual(201)
  })
})

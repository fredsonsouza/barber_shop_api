import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create a Barber Shop (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to create a Barber Shop', async () => {
    const { token } = await createAndAuthenticateUser(app, true, false)

    const response = await request(app.server)
      .post('/barberShops')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Barber Shop',
        phone: '99 99999-9999',
        latitude: -23.5505,
        longitude: -46.6333,
      })

    expect(response.statusCode).toEqual(201)
  })
})

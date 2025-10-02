import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'John Snow',
      email: 'johnsnow@email.com',
      password: '123456',
      sex: 'MALE',
      birth_date: '1990-01-01',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'johnsnow@email.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})

import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Register (e2e', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoeedrrr@email.com',
      password: '123456',
      phone: '23455',
      birth_date: '2023-12-01',
      sex: 'Male',
    })

    expect(response.statusCode).toEqual(201)
  })
})

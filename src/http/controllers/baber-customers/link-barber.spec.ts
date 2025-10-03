import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Link Barber (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('it must be possible to link a barber to a customer', async () => {
    const { token } = await createAndAuthenticateUser(app, false, true)

    const barber = await prisma.user.create({
      data: {
        name: 'Barber Test',
        email: 'barber@test.com',
        password_hash: 'hashedpassword',
        sex: 'Male',
        birth_date: new Date('1990-01-01'),
        role: 'BARBER',
      },
    })

    const response = await request(app.server)
      .post('/barber-customers/link')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userAsBarberId: barber.id,
      })

    expect(response.statusCode).toEqual(201)

    // Checks if the association was created in the database
    const linkOnDb = await prisma.barberCustomer.findFirst({
      where: {
        user_barber_id: barber.id,
      },
    })

    expect(response.body).toEqual({
      link: {
        userAsCustomerId: expect.any(String),
        userAsBarberId: barber.id,
      },
    })
    expect(linkOnDb).toEqual(
      expect.objectContaining({
        user_barber_id: barber.id,
      }),
    )
  })
})

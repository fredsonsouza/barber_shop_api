import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Check-in Metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to get a user metrics', async () => {
    const { token } = await createAndAuthenticateUser(app, false, true)

    const user = await prisma.user.findFirstOrThrow({
      where: {
        role: 'CUSTOMER',
      },
    })

    const barber = await prisma.user.create({
      data: {
        name: 'Barber test',
        email: 'barber@email.com',
        password_hash: '123456',
        sex: 'Male',
        birth_date: new Date('01/02/1990'),
        role: 'BARBER',
      },
    })
    const haircut = await prisma.haircut.create({
      data: {
        name: 'Haircut test',
        description: 'Hairuct description',
        price: 20,
      },
    })

    const barberShop = await prisma.barberShop.create({
      data: {
        title: 'JvaScript Barber Shop',
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          user_id: user.id,
          barber_id: barber.id,
          barber_shop_id: barberShop.id,
          haircut_id: haircut.id,
          price: haircut.price,
          created_at: new Date(),
        },
        {
          user_id: user.id,
          barber_id: barber.id,
          barber_shop_id: barberShop.id,
          haircut_id: haircut.id,
          price: haircut.price,
          created_at: new Date(),
        },
      ],
    })

    const response = await request(app.server)
      .get('/check-ins/customer-metrics')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkInsCount).toEqual(2)
  })
})

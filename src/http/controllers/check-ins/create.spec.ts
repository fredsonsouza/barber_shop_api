import { app } from '@/app'
import request from 'supertest'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to create check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, false, true)
    const user = await prisma.user.findFirstOrThrow({
      where: {
        role: 'CUSTOMER',
      },
    })

    const barberShop = await prisma.barberShop.create({
      data: {
        title: 'JavaScript Barber Shop',
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    })
    const haircut = await prisma.haircut.create({
      data: {
        name: 'Haircut test',
        description: 'Description haircut test',
        price: 20,
      },
    })

    const barber = await prisma.user.create({
      data: {
        name: 'Jonh Doe',
        email: 'johndoe@email.com',
        password_hash: '123456',
        sex: 'Male',
        birth_date: new Date(),
        role: 'BARBER',
      },
    })

    const response = await request(app.server)
      .post(
        `/barberShops/${barberShop.id}/${barber.id}/${haircut.id}/check-ins`,
      )
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    expect(response.statusCode).toEqual(201)
  })
})

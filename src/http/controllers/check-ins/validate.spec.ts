import { app } from '@/app'
import request from 'supertest'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Validate Check-In (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to validate check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true, false)

    const user = await prisma.user.create({
      data: {
        name: 'John Snow',
        email: 'barber@email.com',
        password_hash: '123456',
        sex: 'Male',
        birth_date: new Date('01/02/1990'),
      },
    })

    const barber = await prisma.user.create({
      data: {
        name: 'Barber test',
        email: 'barber@email.com',
        password_hash: '123456',
        sex: 'Male',
        birth_date: new Date('01/02/1990'),
        role: 'CUSTOMER',
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

    let checkIn = await prisma.checkIn.create({
      data: {
        user_id: user.id,
        barber_id: barber.id,
        barber_shop_id: barberShop.id,
        haircut_id: haircut.id,
        price: haircut.price,
        created_at: new Date(),
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    console.log('CheckIn ID criado', checkIn.id)
    expect(response.statusCode).toEqual(204)

    checkIn = await prisma.checkIn.findFirstOrThrow({
      where: {
        id: checkIn.id,
      },
    })
    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})

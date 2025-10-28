import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Choose Haircut (e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('User should be able choose a haircut', async () => {
    const { token } = await createAndAuthenticateUser(app, true, true)

    const user = await prisma.user.findFirstOrThrow()

    const haircut = await prisma.haircut.create({
      data: {
        name: 'Haircut test',
        description: 'Description haircut test',
        price: 20,
        image_url: 'image-01.jpg',
      },
    })

    // --- 1. TEST: FAVORITE (First Toggle) ---
    const favoriteResponse = await request(app.server)
      .post(`/users/favorites/${haircut.id}/toggle`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user.id,
        haircutId: haircut.id,
        favorited: true,
      })
    expect(favoriteResponse.statusCode).toEqual(200)
    expect(favoriteResponse.body.favorited).toBe(true)

    // --- 2. TEST: UNFAVORITE (Second Toggle) ---
    const unfavoriteResponse = await request(app.server)
      .post(`/users/favorites/${haircut.id}/toggle`)
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(unfavoriteResponse.statusCode).toEqual(200)
    // Verifica se o estado inverteu para FALSE
    expect(unfavoriteResponse.body.favorited).toBe(false)
  })
})

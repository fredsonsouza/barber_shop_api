import { InMemoryBarberShopsRepository } from '@/repositories/in-memory/in-memory-barber-shops-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateBarberShopUseCase } from './create-barber-shop'

let barberShopsRepository: InMemoryBarberShopsRepository
let sut: CreateBarberShopUseCase

describe('Create a Barber Shop', () => {
  beforeEach(() => {
    barberShopsRepository = new InMemoryBarberShopsRepository()
    sut = new CreateBarberShopUseCase(barberShopsRepository)
  })

  it('Should be able to create a barber shop', async () => {
    const { barberShop } = await sut.execute({
      title: 'JavaScript Barber Shop',
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    expect(barberShop.id).toEqual(expect.any(String))
  })
})

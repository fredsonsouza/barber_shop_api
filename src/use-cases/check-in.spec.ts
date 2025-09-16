import { InMemoryBarberShopsRepository } from '@/repositories/in-memory/in-memory-barber-shops-repository'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { MaxNumberCheckInsError } from './error/max-number-of-check-ins-error'
import { Decimal } from 'generated/prisma/runtime/library'
import { MaxDistanceError } from './error/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let barberShopsRepository: InMemoryBarberShopsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    barberShopsRepository = new InMemoryBarberShopsRepository()
    sut = new CheckInUseCase(checkInsRepository, barberShopsRepository)

    await barberShopsRepository.create({
      id: 'barber-shop-01',
      title: 'JavaScript Barber Shop',
      phone: '000000',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      barberShopId: 'barber-shop-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('Should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      barberShopId: 'barber-shop-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        barberShopId: 'barber-shop-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxNumberCheckInsError)
  })

  it('Should be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      barberShopId: 'barber-shop-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    vi.setSystemTime(new Date(2025, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      barberShopId: 'barber-shop-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should be able to check in on distance', async () => {
    barberShopsRepository.items.push({
      id: 'barber-shop-02',
      title: 'TypeScript Barber Shop',
      phone: '1111111',
      latitude: new Decimal(-2.8052234),
      longitude: new Decimal(-60.7592569),
    })

    await expect(() =>
      sut.execute({
        barberShopId: 'barber-shop-02',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})

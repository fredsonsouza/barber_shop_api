import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { describe } from 'node:test'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { ValidateCheckInUsecase } from './validate-check-in'
import { ResourceNotFoundError } from './error/resource-not-found-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUsecase

describe('Validte Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUsecase(checkInsRepository)

    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-01',
      barber_id: 'barber-01',
      barber_shop_id: 'barber-shop-01',
      haircut_id: 'baircut-01',
      price: 20,
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0]?.validated_at).toEqual(expect.any(Date))
  })

  it('Should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
  it('Should not be able to validate the check-in after 20min it creation', async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-01',
      barber_id: 'barber-01',
      barber_shop_id: 'barber-shop-01',
      haircut_id: 'baircut-01',
      price: 20,
    })
    const twentyOndeMinutesInSeconds = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOndeMinutesInSeconds)

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})

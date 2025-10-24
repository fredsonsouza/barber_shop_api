import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetBarberMetricsUseCase } from './get-barber-metrics'
import { Prisma } from 'generated/prisma'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetBarberMetricsUseCase
describe('Get Barber Metrics Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetBarberMetricsUseCase(checkInsRepository)

    checkInsRepository.users.push({
      id: 'customer-01',
      name: 'John Doe',
      email: 'john@email.com',
      role: 'CUSTOMER',
      password_hash: '123',
      created_at: new Date(),
      sex: 'Male',
      phone: null,
      birth_date: new Date(),
    })
    checkInsRepository.users.push({
      id: 'customer-02',
      name: 'Jane Smith',
      email: 'jane@email.com',
      role: 'CUSTOMER',
      password_hash: '123',
      created_at: new Date(),
      sex: 'Male',
      phone: null,
      birth_date: new Date(),
    })

    checkInsRepository.users.push({
      id: 'barber-01',
      name: 'Bob the Barber',
      email: 'bob@email.com',
      role: 'BARBER',
      password_hash: '123',
      sex: 'Male',
      phone: null,
      birth_date: new Date(),
      created_at: new Date(),
    })
    checkInsRepository.users.push({
      id: 'barber-02',
      name: 'Charlie Cutter',
      email: 'charlie@email.com',
      role: 'BARBER',
      password_hash: '123',
      created_at: new Date(),
      sex: 'Male',
      phone: null,
      birth_date: new Date(),
    })
    checkInsRepository.haircuts.push({
      id: 'haircut-01',
      name: 'Corte Simples',
      price: new Prisma.Decimal(50),
      description: 'Atual corte',
      created_at: new Date(),
      updated_at: new Date(),
    })
    checkInsRepository.haircuts.push({
      id: 'haircut-02',
      name: 'Corte Social',
      description: 'Barba',
      price: new Prisma.Decimal(30),
      created_at: new Date(),
      updated_at: new Date(),
    })
  })

  it('should be able to get total check-ins count and total revenue', async () => {
    await checkInsRepository.create({
      barber_id: 'barber-01',
      user_id: 'customer-01',
      haircut_id: 'haircut-01',
      price: new Prisma.Decimal(50),
      barber_shop_id: 'shop-01',
    })
    await checkInsRepository.create({
      barber_id: 'barber-01',
      user_id: 'customer-02',
      haircut_id: 'haircut-02',
      price: new Prisma.Decimal(30),
      barber_shop_id: 'shop-01',
    })
    await checkInsRepository.create({
      barber_id: 'barber-02',
      user_id: 'customer-01',
      haircut_id: 'haircut-01',
      price: new Prisma.Decimal(50),
      barber_shop_id: 'shop-01',
    })

    const { totalCheckIns, totalRevenue } = await sut.execute({
      barberId: 'barber-01',
    })

    expect(totalCheckIns).toEqual(2)
    expect(totalRevenue).toEqual(80)
  })

  it('Should be able to get the most frequent customer', async () => {
    for (let i = 0; i < 3; i++) {
      await checkInsRepository.create({
        barber_id: 'barber-01',
        user_id: 'customer-01',
        haircut_id: 'haircut-01',
        price: new Prisma.Decimal(50),
        barber_shop_id: 'shop-01',
      })
    }
    for (let i = 0; i < 2; i++) {
      await checkInsRepository.create({
        barber_id: 'barber-01',
        user_id: 'customer-02',
        haircut_id: 'haircut-02',
        price: new Prisma.Decimal(30),
        barber_shop_id: 'shop-01',
      })
    }
    for (let i = 0; i < 5; i++) {
      await checkInsRepository.create({
        barber_id: 'barber-02',
        user_id: 'customer-01',
        haircut_id: 'haircut-01',
        price: new Prisma.Decimal(50),
        barber_shop_id: 'shop-01',
      })
    }
    const { mostFrequentCustomer } = await sut.execute({
      barberId: 'barber-01',
    })

    expect(mostFrequentCustomer).toEqual(
      expect.objectContaining({
        customerId: 'customer-01',
        customerName: 'John Doe',
        count: 3,
      }),
    )
  })
  it('Should be able to get the most frequent haircut', async () => {
    for (let i = 0; i < 4; i++) {
      await checkInsRepository.create({
        barber_id: 'barber-01',
        user_id: 'customer-01',
        haircut_id: 'haircut-01',
        price: new Prisma.Decimal(50),
        barber_shop_id: 'shop-01',
      })
    }
    for (let i = 0; i < 2; i++) {
      await checkInsRepository.create({
        barber_id: 'barber-01',
        user_id: 'customer-02',
        haircut_id: 'haircut-02',
        price: new Prisma.Decimal(30),
        barber_shop_id: 'shop-01',
      })
    }
    for (let i = 0; i < 5; i++) {
      await checkInsRepository.create({
        barber_id: 'barber-02',
        user_id: 'customer-02',
        haircut_id: 'haircut-02',
        price: new Prisma.Decimal(30),
        barber_shop_id: 'shop-01',
      })
    }
    const { mostFrequentHaircut } = await sut.execute({
      barberId: 'barber-01',
    })
    expect(mostFrequentHaircut).toEqual(
      expect.objectContaining({
        haircutId: 'haircut-01',
        haircutName: 'Corte Simples',
        count: 4,
      }),
    )
  })
  it('should return zeros and nulls when barber has no check-ins', async () => {
    const {
      totalCheckIns,
      totalRevenue,
      mostFrequentCustomer,
      mostFrequentHaircut,
    } = await sut.execute({
      barberId: 'barber-01',
    })

    expect(totalCheckIns).toBe(0)
    expect(totalRevenue).toBe(0)
    expect(mostFrequentCustomer).toBeNull()
    expect(mostFrequentHaircut).toBeNull()
  })
})

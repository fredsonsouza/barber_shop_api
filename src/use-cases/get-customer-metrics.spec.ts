import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryHaircutsRepository } from '@/repositories/in-memory/in-memory-haircuts-repository'
import { GetCustomerMetricsUseCase } from './get-customer-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let haircutsRepository: InMemoryHaircutsRepository
let sut: GetCustomerMetricsUseCase

describe('Get Customer Metrics Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    haircutsRepository = new InMemoryHaircutsRepository()
    sut = new GetCustomerMetricsUseCase(checkInsRepository)

    checkInsRepository.users.push({
      id: 'user-01',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: '123456',
      role: 'CUSTOMER',
      sex: 'Male',
      phone: '122222',
      created_at: new Date(),
      birth_date: new Date(),
    })

    checkInsRepository.users.push({
      id: 'barber-01',
      name: 'John Snow',
      email: 'johnsnow@email.com',
      password_hash: '123456',
      role: 'CUSTOMER',
      sex: 'Male',
      phone: '122222',
      created_at: new Date(),
      birth_date: new Date(),
    })
  })

  it('Should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      user_id: 'user-01',
      barber_shop_id: 'barber-shop-01',
      haircut_id: 'haircut-01',
      barber_id: 'barber-01',
      price: 20,
    })

    await checkInsRepository.create({
      user_id: 'user-01',
      barber_shop_id: 'barber-shop-01',
      haircut_id: 'haircut-01',
      barber_id: 'barber-01',
      price: 22,
    })
    const { checkInsCount } = await sut.execute({
      userCustomerId: 'user-01',
    })
    expect(checkInsCount).toEqual(2)
  })

  it('Should be able to calculate check-ins count and total spent', async () => {
    await checkInsRepository.create({
      user_id: 'user-01',
      barber_shop_id: 'barber-shop-01',
      haircut_id: 'haircut-01',
      barber_id: 'barber-01',
      price: 20,
    })

    await checkInsRepository.create({
      user_id: 'user-01',
      barber_shop_id: 'barber-shop-01',
      haircut_id: 'haircut-01',
      barber_id: 'barber-01',
      price: 22,
    })

    const result = await sut.execute({ userCustomerId: 'user-01' })
    expect(result.checkInsCount).toBe(2)
    expect(result.totalSpent).toBe(42)
  })

  it('Shoul be able to return the favorite haircut with barber and count', async () => {
    const haircut = await haircutsRepository.create({
      id: 'haircut-01',
      name: 'Social cut',
      description: 'An ellegant cut',
      price: 25,
    })

    checkInsRepository.haircuts.push(haircut)

    await checkInsRepository.create({
      user_id: 'user-01',
      barber_shop_id: 'barber-shop-01',
      haircut_id: haircut.id,
      barber_id: 'barber-01',
      price: haircut.price,
    })

    await checkInsRepository.create({
      user_id: 'user-01',
      barber_shop_id: 'barber-shop-01',
      haircut_id: haircut.id,
      barber_id: 'barber-01',
      price: haircut.price,
    })
    const result = await sut.execute({ userCustomerId: 'user-01' })

    expect(result.favoriteHaircut).toEqual({
      haircutId: 'haircut-01',
      haircutName: 'Social cut',
      barberId: 'barber-01',
      barberName: 'John Snow',
      count: 2,
    })
  })

  it('Should be able to return 0 check-ins and total spent 0 for a customer with no check-in', async () => {
    const result = await sut.execute({ userCustomerId: 'user-01' })

    expect(result.checkInsCount).toBe(0)
    expect(result.totalSpent).toBe(0)
    expect(result.favoriteHaircut).toBeNull()
  })
})

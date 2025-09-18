import { InMemoryBarberCustomersRepository } from '@/repositories/in-memory/in-memory-barbercustomers-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { LinkCustomerToBarberUseCase } from './link-customer-to-barber'
import { hash } from 'bcryptjs'
import { InvalidUserRoleError } from './error/invalid-user-role-error'
import { DuplicateLinkCustomerToBarberError } from './error/duplicate-link-customer-to-barber-error'

let usersRepository: InMemoryUsersRepository
let barberCustomersRepository: InMemoryBarberCustomersRepository
let sut: LinkCustomerToBarberUseCase

describe('Link Customer to Barber Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    barberCustomersRepository = new InMemoryBarberCustomersRepository()
    sut = new LinkCustomerToBarberUseCase(
      usersRepository,
      barberCustomersRepository,
    )
  })

  it('Should be able to link a customer to a barber', async () => {
    const barber = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('123456', 6),
      birth_date: new Date('12/01/2023'),
      sex: 'Male',
      role: 'BARBER',
    })

    const customer = await usersRepository.create({
      name: 'Fredson Souza',
      email: 'fred@email.com',
      password_hash: await hash('123456', 6),
      birth_date: new Date('12/01/2023'),
      sex: 'Male',
    })

    const { link } = await sut.execute({
      userAsBarberId: barber.id,
      userAsCustomerId: customer.id,
    })

    expect(link.userAsBarberId).toBe(barber.id)
    expect(link.userAsCustomerId).toBe(customer.id)
  })

  it('Should not allow linking the same customer to the same barber twice', async () => {
    const barber = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('123456', 6),
      birth_date: new Date('12/01/2023'),
      sex: 'Male',
      role: 'BARBER',
    })

    const customer = await usersRepository.create({
      name: 'Fredson Souza',
      email: 'fred@email.com',
      password_hash: await hash('123456', 6),
      birth_date: new Date('12/01/2023'),
      sex: 'Male',
    })

    await sut.execute({
      userAsBarberId: barber.id,
      userAsCustomerId: customer.id,
    })

    await expect(() =>
      sut.execute({
        userAsBarberId: barber.id,
        userAsCustomerId: customer.id,
      }),
    ).rejects.toBeInstanceOf(DuplicateLinkCustomerToBarberError)
  })

  it('Should allow a barber have many customers', async () => {
    const barber = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('123456', 6),
      birth_date: new Date('12/01/2023'),
      sex: 'Male',
      role: 'BARBER',
    })

    const customer1 = await usersRepository.create({
      name: 'Fredson Souza',
      email: 'fred@email.com',
      password_hash: await hash('123456', 6),
      birth_date: new Date('12/01/2023'),
      sex: 'Male',
    })

    const customer2 = await usersRepository.create({
      name: 'John Snow',
      email: 'john@email.com',
      password_hash: await hash('123456', 6),
      birth_date: new Date('12/01/2023'),
      sex: 'Male',
    })

    const { link: link1 } = await sut.execute({
      userAsBarberId: barber.id,
      userAsCustomerId: customer1.id,
    })

    expect(link1.userAsBarberId).toBe(barber.id)
    expect(link1.userAsCustomerId).toBe(customer1.id)

    const { link: link2 } = await sut.execute({
      userAsBarberId: barber.id,
      userAsCustomerId: customer2.id,
    })

    expect(link2.userAsBarberId).toBe(barber.id)
    expect(link2.userAsCustomerId).toBe(customer2.id)

    const links = await barberCustomersRepository.findBarberById(barber.id)

    console.log(links)
    expect(links).toHaveLength(2)
    expect(links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user_barber_id: barber.id,
          user_customer_id: customer1.id,
        }),
        expect.objectContaining({
          user_barber_id: barber.id,
          user_customer_id: customer2.id,
        }),
      ]),
    )
  })

  it('Should not to link an barber to customer', async () => {
    const barber = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('123456', 6),
      birth_date: new Date('12/01/2023'),
      sex: 'Male',
      role: 'CUSTOMER',
    })

    const customer = await usersRepository.create({
      name: 'Fredson Souza',
      email: 'fred@email.com',
      password_hash: await hash('123456', 6),
      birth_date: new Date('12/01/2023'),
      sex: 'Male',
      role: 'BARBER',
    })

    await expect(() =>
      sut.execute({
        userAsBarberId: barber.id,
        userAsCustomerId: customer.id,
      }),
    ).rejects.toBeInstanceOf(InvalidUserRoleError)
  })
})

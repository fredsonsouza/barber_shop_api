import { InMemoryBarberCustomersRepository } from '@/repositories/in-memory/in-memory-barbercustomers-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InvalidUserRoleError } from './error/invalid-user-role-error'
import { ChooseBarberUseCase } from './choose-barber'
import { DuplicateChooseBarberError } from './error/duplicate-choose-barber-error'

let usersRepository: InMemoryUsersRepository
let barberCustomersRepository: InMemoryBarberCustomersRepository
let sut: ChooseBarberUseCase

describe('Choose Barber Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    barberCustomersRepository = new InMemoryBarberCustomersRepository()
    sut = new ChooseBarberUseCase(usersRepository, barberCustomersRepository)
  })

  it('Should be able to connect a customer to a barber', async () => {
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

    const { connection } = await sut.execute({
      userAsBarberId: barber.id,
      userAsCustomerId: customer.id,
    })

    expect(connection.userAsBarberId).toBe(barber.id)
    expect(connection.userAsCustomerId).toBe(customer.id)
  })

  it('Should not allow connecting the same customer to the same barber twice', async () => {
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
    ).rejects.toBeInstanceOf(DuplicateChooseBarberError)
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

    const { connection: connection1 } = await sut.execute({
      userAsBarberId: barber.id,
      userAsCustomerId: customer1.id,
    })

    expect(connection1.userAsBarberId).toBe(barber.id)
    expect(connection1.userAsCustomerId).toBe(customer1.id)

    const { connection: connection2 } = await sut.execute({
      userAsBarberId: barber.id,
      userAsCustomerId: customer2.id,
    })

    expect(connection2.userAsBarberId).toBe(barber.id)
    expect(connection2.userAsCustomerId).toBe(customer2.id)

    const connections = await barberCustomersRepository.findBarberById(
      barber.id,
    )

    expect(connections).toHaveLength(2)
    expect(connections).toEqual(
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

  it('Should not to connect an barber to customer', async () => {
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

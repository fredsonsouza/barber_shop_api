import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './error/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get Profile User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('Should be able to get user profile', async () => {
    const createUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('123456', 6),
      birth_date: new Date('12/01/2023'),
      sex: 'Male',
    })

    const { user } = await sut.execute({
      userId: createUser.id,
    })

    expect(user.name).toEqual('John Doe')
  })
  it('Should be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

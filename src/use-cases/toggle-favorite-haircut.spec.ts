import { InMemoryHaircutsRepository } from '@/repositories/in-memory/in-memory-haircuts-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './error/resource-not-found-error'
import { ToggleFavoriteHaircutUseCase } from './toggle-favorite-haircut'

let usersRepository: InMemoryUsersRepository
let haircutsRepository: InMemoryHaircutsRepository
let sut: ToggleFavoriteHaircutUseCase

describe('Choose Favorite Haircut Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    haircutsRepository = new InMemoryHaircutsRepository()
    sut = new ToggleFavoriteHaircutUseCase(usersRepository, haircutsRepository)
  })

  it('Should be able to favorite a haircut', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      birth_date: new Date('15/09/2000'),
      password_hash: '123456',
      sex: 'Male',
    })

    const haircut = await haircutsRepository.create({
      name: 'Social Cut',
      description: 'An ellegant haircut',
      price: 30,
      image_url: 'image-01.jpg',
    })
    const result = await sut.execute({
      userId: user.id,
      haircutId: haircut.id,
    })

    expect(result.favorited).toBe(true)
    expect(usersRepository.userFavorites[user.id]).toContain(haircut.id)
  })
  it('Should be able to favorite many haircuts', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      birth_date: new Date('15/09/2000'),
      password_hash: '123456',
      sex: 'Male',
    })

    const haircut1 = await haircutsRepository.create({
      name: 'Cut 1',
      description: 'Desc 1',
      price: 20,
      image_url: 'image-01.jpg',
    })

    const haircut2 = await haircutsRepository.create({
      name: 'Cut 2',
      description: 'Desc 2',
      price: 25,
      image_url: 'image-01.jpg',
    })

    const haircut3 = await haircutsRepository.create({
      name: 'Cut 3',
      description: 'Desc 3',
      price: 30,
      image_url: 'image-01.jpg',
    })

    await sut.execute({
      userId: user.id,
      haircutId: haircut1.id,
    })

    await sut.execute({
      userId: user.id,
      haircutId: haircut2.id,
    })

    await sut.execute({
      userId: user.id,
      haircutId: haircut3.id,
    })

    const favorites = usersRepository.userFavorites[user.id]

    expect(favorites).toHaveLength(3)
    expect(favorites).toEqual(
      expect.arrayContaining([haircut1.id, haircut2.id, haircut3.id]),
    )
  })

  it('Should be able to unfavorite a haircut if already favorited', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      birth_date: new Date('15/09/2000'),
      password_hash: '123456',
      sex: 'Male',
    })

    const haircut = await haircutsRepository.create({
      name: 'Social Cut',
      description: 'An ellegant haircut',
      price: 30,
      image_url: 'image-01.jpg',
    })

    await sut.execute({
      userId: user.id,
      haircutId: haircut.id,
    })
    expect(usersRepository.userFavorites[user.id]).toContain(haircut.id)

    const result = await sut.execute({
      userId: user.id,
      haircutId: haircut.id,
    })

    expect(result.favorited).toBe(false)
    expect(usersRepository.userFavorites[user.id]).not.toContain(haircut.id)
  })

  it('Should not be able to favorite haircut with wrong user-id', async () => {
    const haircut = await haircutsRepository.create({
      name: 'Social Cut',
      description: 'An ellegant haircut',
      price: 30,
      image_url: 'image-01.jpg',
    })

    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
        haircutId: haircut.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Should not be able to favorite haircut with wrong haircut-id', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      birth_date: new Date('15/09/2000'),
      password_hash: '123456',
      sex: 'Male',
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        haircutId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

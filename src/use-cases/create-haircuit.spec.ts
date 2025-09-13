import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryHaircutsRepository } from '@/repositories/in-memory/in-memory-haircuts-repository'
import { CreateHaircutUseCase } from './create-haircut'
import { HaircutAlreadyExistsError } from './error/haircut-already-exists-error'

let haircutsRepository: InMemoryHaircutsRepository
let sut: CreateHaircutUseCase

describe('Create Haircut', () => {
  beforeEach(() => {
    haircutsRepository = new InMemoryHaircutsRepository()
    sut = new CreateHaircutUseCase(haircutsRepository)
  })
  it('Should be able to create a haircut', async () => {
    const { haircut } = await sut.execute({
      name: 'Social Cut',
      description: 'An elegant cut',
      price: 20,
    })
    console.log(haircut.id)
    expect(haircut.id).toEqual(expect.any(String))
  })
  it('Should not be able to create a haircut with the same name', async () => {
    const name = 'Social Cut'

    await sut.execute({
      name,
      description: 'An elegant cut',
      price: 20,
    })

    await expect(() =>
      sut.execute({
        name,
        description: 'An elegant cut',
        price: 20,
      }),
    ).rejects.toBeInstanceOf(HaircutAlreadyExistsError)
  })
})

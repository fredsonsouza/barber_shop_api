import { InMemoryHaircutsRepository } from '@/repositories/in-memory/in-memory-haircuts-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateHaircutUseCase } from './update-haircut'
import { ResourceNotFoundError } from './error/resource-not-found-error'

let haircutsRepository: InMemoryHaircutsRepository
let sut: UpdateHaircutUseCase

describe('Update Haircut Use Case', () => {
  beforeEach(() => {
    haircutsRepository = new InMemoryHaircutsRepository()
    sut = new UpdateHaircutUseCase(haircutsRepository)
  })

  it('Should be able to update only the name of a haircut', async () => {
    const haircut = await haircutsRepository.create({
      name: 'Cut Test',
      description: 'Description cut test',
      price: 20,
    })

    const { updatedHaircut } = await sut.execute({
      id: haircut.id,
      name: 'Social cut',
    })
    expect(updatedHaircut.id).toEqual(haircut.id)
    expect(haircut.name).toEqual('Social cut')
  })

  it('Should be able to update only the description of a haircut', async () => {
    const haircut = await haircutsRepository.create({
      name: 'Cut Test',
      description: 'Description cut test',
      price: 20,
    })

    const { updatedHaircut } = await sut.execute({
      id: haircut.id,
      description: 'An ellegant cut',
    })

    expect(updatedHaircut.id).toEqual(haircut.id)
    expect(haircut.description).toEqual('An ellegant cut')
  })

  it('Should be able to update only the price of a haircut', async () => {
    const haircut = await haircutsRepository.create({
      name: 'Cut Test',
      description: 'Description cut test',
      price: 20,
    })

    const { updatedHaircut } = await sut.execute({
      id: haircut.id,
      price: 30.0,
    })

    expect(updatedHaircut.id).toEqual(haircut.id)
    expect(haircut.price.toNumber()).toEqual(30.0)
  })

  it('Should be able to update multiple fields of a haircut', async () => {
    const haircut = await haircutsRepository.create({
      name: 'Cut Test',
      description: 'Description cut test',
      price: 20,
    })

    const { updatedHaircut } = await sut.execute({
      id: haircut.id,
      name: 'Social cut',
      description: 'An ellegant cut',
      price: 25.0,
    })

    expect(updatedHaircut.id).toEqual(haircut.id)
    expect(haircut.name).toEqual('Social cut')
    expect(haircut.description).toEqual('An ellegant cut')
    expect(haircut.price.toNumber()).toEqual(25.0)
  })
  it('Should not be able to update a haircut with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

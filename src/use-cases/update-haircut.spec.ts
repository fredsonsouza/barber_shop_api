import { InMemoryHaircutsRepository } from '@/repositories/in-memory/in-memory-haircuts-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateHaircutUseCase } from './update-haircut'
import { ResourceNotFoundError } from './error/resource-not-found-error'
import { InMemoryStorageProvider } from '@/repositories/in-memory/in-memory-storage-provider'

let haircutsRepository: InMemoryHaircutsRepository
let storageProvider: InMemoryStorageProvider
let sut: UpdateHaircutUseCase

describe('Update Haircut Use Case', () => {
  beforeEach(() => {
    haircutsRepository = new InMemoryHaircutsRepository()
    storageProvider = new InMemoryStorageProvider() // 3. Instanciar
    sut = new UpdateHaircutUseCase(haircutsRepository, storageProvider)
  })

  it('Should be able to update only the name of a haircut', async () => {
    const haircut = await haircutsRepository.create({
      name: 'Cut Test',
      description: 'Description cut test',
      price: 20,
      image_url: 'old.jpg',
    })

    const { updatedHaircut } = await sut.execute({
      id: haircut.id,
      name: 'Social cut',
    })
    expect(updatedHaircut.id).toEqual(haircut.id)
    expect(haircut.name).toEqual('Social cut')
    expect(haircut.image_url).toEqual('old.jpg')
  })

  it('Should be able to update only the description of a haircut', async () => {
    const haircut = await haircutsRepository.create({
      name: 'Cut Test',
      description: 'Description cut test',
      price: 20,
      image_url: 'old.jpg',
    })

    const { updatedHaircut } = await sut.execute({
      id: haircut.id,
      description: 'An ellegant cut',
    })

    expect(updatedHaircut.id).toEqual(haircut.id)
    expect(haircut.description).toEqual('An ellegant cut')
    expect(haircut.image_url).toEqual('old.jpg')
  })

  it('Should be able to update only the price of a haircut', async () => {
    const haircut = await haircutsRepository.create({
      name: 'Cut Test',
      description: 'Description cut test',
      price: 20,
      image_url: 'old.jpg',
    })

    const { updatedHaircut } = await sut.execute({
      id: haircut.id,
      price: 30.0,
    })

    expect(updatedHaircut.id).toEqual(haircut.id)
    expect(haircut.price.toNumber()).toEqual(30.0)
    expect(haircut.image_url).toEqual('old.jpg')
  })

  it('Should be able to update multiple fields of a haircut', async () => {
    const haircut = await haircutsRepository.create({
      name: 'Cut Test',
      description: 'Description cut test',
      price: 20,
      image_url: 'old.jpg',
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
  it('should be able to update only the image', async () => {
    const haircut = await haircutsRepository.create({
      name: 'Cut Test',
      description: 'Description cut test',
      price: 20,
      image_url: 'null',
    })

    const { updatedHaircut } = await sut.execute({
      id: haircut.id,
      imageTempFileName: 'new-image.jpg',
      imageMimeType: 'image/jpeg',
    })

    expect(updatedHaircut.image_url).toEqual('new-image.jpg')
    expect(storageProvider.files).toEqual(['new-image.jpg'])
  })

  it('should delete the old image when updating to a new one', async () => {
    storageProvider.files.push('old-image.jpg')
    const haircut = await haircutsRepository.create({
      name: 'Cut Test',
      description: 'Description cut test',
      price: 20,
      image_url: 'old-image.jpg',
    })

    const { updatedHaircut } = await sut.execute({
      id: haircut.id,
      name: 'New Name',
      imageTempFileName: 'new-image.jpg',
      imageMimeType: 'image/jpeg',
    })

    expect(updatedHaircut.image_url).toEqual('new-image.jpg')
    expect(updatedHaircut.name).toEqual('New Name')
    expect(storageProvider.files).toHaveLength(1)
    expect(storageProvider.files).toEqual(['new-image.jpg'])
  })
})

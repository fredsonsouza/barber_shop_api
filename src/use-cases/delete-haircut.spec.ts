import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryHaircutsRepository } from '@/repositories/in-memory/in-memory-haircuts-repository'
import { DeleteHaircutUseCase } from './delete-haircut'
import { HaircutNotFoundError } from './error/haircut-not-found-error'
import { InMemoryStorageProvider } from '@/repositories/in-memory/in-memory-storage-provider'

let haircutsRepository: InMemoryHaircutsRepository
let storageProvider: InMemoryStorageProvider
let sut: DeleteHaircutUseCase

describe('Delete Haircut Use Case', () => {
  beforeEach(() => {
    haircutsRepository = new InMemoryHaircutsRepository()
    storageProvider = new InMemoryStorageProvider()
    sut = new DeleteHaircutUseCase(haircutsRepository, storageProvider)
  })

  it('should be able to delete a haircut', async () => {
    const createdHaircut = await haircutsRepository.create({
      name: 'Corte Teste',
      description: '...',
      price: 25,
      image_url: 'teste-image.jpg', // Nome do arquivo
    })

    storageProvider.files.push('teste-image.jpg')

    await sut.execute({
      haircutId: createdHaircut.id,
    })

    expect(haircutsRepository.items).toHaveLength(0)

    expect(storageProvider.files).toHaveLength(0)
  })

  it('should not be able to delete a non-existing haircut', async () => {
    await expect(() =>
      sut.execute({
        haircutId: 'id-inexistente',
      }),
    ).rejects.toBeInstanceOf(HaircutNotFoundError)
  })

  it('should delete haircut from database even if file does not exist in storage', async () => {
    const createdHaircut = await haircutsRepository.create({
      name: 'Corte Teste 2',
      description: '...',
      price: 30,
      image_url: 'imagem-fantasma.jpg',
    })

    await sut.execute({
      haircutId: createdHaircut.id,
    })

    expect(haircutsRepository.items).toHaveLength(0)
  })
})

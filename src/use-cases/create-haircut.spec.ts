import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryHaircutsRepository } from '@/repositories/in-memory/in-memory-haircuts-repository'
import { CreateHaircutUseCase } from './create-haircut'
import { HaircutAlreadyExistsError } from './error/haircut-already-exists-error'
import { InMemorySTorageProvider } from '@/repositories/in-memory/in-memory-storage-provider'
import { InvalidFileTypeError } from './error/invalid-file-type-error'

let haircutsRepository: InMemoryHaircutsRepository
let storageProvider: InMemorySTorageProvider
let sut: CreateHaircutUseCase

describe('Create Haircut', () => {
  beforeEach(() => {
    haircutsRepository = new InMemoryHaircutsRepository()
    storageProvider = new InMemorySTorageProvider()
    sut = new CreateHaircutUseCase(haircutsRepository, storageProvider)
  })
  it('Should be able to create a haircut', async () => {
    const { haircut } = await sut.execute({
      name: 'Social Cut',
      description: 'An elegant cut',
      price: 20,
      imageTempFileName: 'temp-image.jpg',
      imageMimeType: 'image/jpeg',
    })
    expect(haircut.id).toEqual(expect.any(String))

    expect(storageProvider.files).toHaveLength(1)
    expect(storageProvider.files[0]).toEqual('temp-image.jpg')

    // 2. Verifica se o repositório de haircuts salvou a URL correta
    expect(haircutsRepository.items).toHaveLength(1)
    expect(haircutsRepository.items[0]!.image_url).toEqual('temp-image.jpg')
  })
  it('Should not be able to create a haircut with the same name', async () => {
    const name = 'Social Cut'

    await sut.execute({
      name,
      description: 'An elegant cut',
      price: 20,
      imageTempFileName: 'temp-image.jpg',
      imageMimeType: 'image/jpeg',
    })

    await expect(() =>
      sut.execute({
        name,
        description: 'An elegant cut',
        price: 20,
        imageTempFileName: 'temp-image.jpg',
        imageMimeType: 'image/jpeg',
      }),
    ).rejects.toBeInstanceOf(HaircutAlreadyExistsError)
  })
  it('should not be able to create a haircut with an invalid mime type', async () => {
    await expect(() =>
      sut.execute({
        name: 'PDF Cut',
        description: 'An elegant cut',
        price: 20,
        imageTempFileName: 'temp-image.pdf',
        imageMimeType: 'application/pdf', // <-- Tipo inválido
      }),
    ).rejects.toBeInstanceOf(InvalidFileTypeError)
  })
})

import { HaircutsRepository } from '@/repositories/haircuts-repository'
import { Haircut } from 'generated/prisma'
import { ResourceNotFoundError } from './error/resource-not-found-error'
import type { StorageProvider } from '@/repositories/storage-provider'
import { InvalidFileTypeError } from './error/invalid-file-type-error'

export interface UpdateHaircutUseCaseRequest {
  id: string
  name?: string
  description?: string
  price?: number
  imageTempFileName?: string
  imageMimeType?: string
}
export interface UpdateHaircutUseCaseResponse {
  updatedHaircut: Haircut
}

export class UpdateHaircutUseCase {
  constructor(
    private haircutRepository: HaircutsRepository,
    private storageProvider: StorageProvider,
  ) {}

  async execute({
    id,
    name,
    description,
    price,
    imageTempFileName,
    imageMimeType,
  }: UpdateHaircutUseCaseRequest): Promise<UpdateHaircutUseCaseResponse> {
    const haircut = await this.haircutRepository.findById(id)

    if (!haircut) {
      throw new ResourceNotFoundError()
    }

    let newFileKey: string | undefined = undefined
    const oldFileKey = haircut.image_url

    if (imageTempFileName) {
      if (!imageMimeType || !imageMimeType.startsWith('image/')) {
        throw new InvalidFileTypeError()
      }
      newFileKey = await this.storageProvider.save(imageTempFileName)
    }

    const updatedHaircut = await this.haircutRepository.update(id, {
      name,
      description,
      price,
      imageUrl: newFileKey,
    })

    if (!updatedHaircut) {
      throw new ResourceNotFoundError()
    }

    if (newFileKey && oldFileKey) {
      await this.storageProvider.delete(oldFileKey)
    }

    return { updatedHaircut }
  }
}

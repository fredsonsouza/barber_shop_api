import { HaircutsRepository } from '@/repositories/haircuts-repository'
import { Haircut } from 'generated/prisma'
import { HaircutAlreadyExistsError } from './error/haircut-already-exists-error'
import type { StorageProvider } from '@/repositories/storage-provider'
import { InvalidFileTypeError } from './error/invalid-file-type-error'

export interface CreateHaircutUseCaseRequest {
  name: string
  description: string
  price: number
  imageTempFileName: string
  imageMimeType: string
}
export interface CreateHaircutUseCaseResponse {
  haircut: Haircut
}
export class CreateHaircutUseCase {
  constructor(
    private haircutsRepository: HaircutsRepository,
    private storageProvider: StorageProvider,
  ) {}

  async execute({
    name,
    description,
    price,
    imageTempFileName,
    imageMimeType,
  }: CreateHaircutUseCaseRequest): Promise<CreateHaircutUseCaseResponse> {
    const haircutWithSameName = await this.haircutsRepository.findByName(name)

    if (haircutWithSameName) {
      throw new HaircutAlreadyExistsError()
    }
    if (!imageMimeType.startsWith('image/')) {
      throw new InvalidFileTypeError()
    }

    const fileKey = await this.storageProvider.save(imageTempFileName)
    const haircut = await this.haircutsRepository.create({
      name,
      description,
      price,
      image_url: fileKey,
    })
    return { haircut }
  }
}

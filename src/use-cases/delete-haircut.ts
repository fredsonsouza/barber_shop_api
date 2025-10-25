import { HaircutsRepository } from '@/repositories/haircuts-repository'
import { StorageProvider } from '@/repositories/storage-provider'
import { HaircutNotFoundError } from './error/haircut-not-found-error'

export interface DeleteHaircutUseCaseRequest {
  haircutId: string
}

export class DeleteHaircutUseCase {
  constructor(
    private haircutsRepository: HaircutsRepository,
    private storageProvider: StorageProvider,
  ) {}

  async execute({ haircutId }: DeleteHaircutUseCaseRequest): Promise<void> {
    const haircut = await this.haircutsRepository.findById(haircutId)

    if (!haircut) {
      throw new HaircutNotFoundError()
    }

    if (haircut.image_url) {
      await this.storageProvider.delete(haircut.image_url)
    }

    await this.haircutsRepository.delete(haircutId)
  }
}

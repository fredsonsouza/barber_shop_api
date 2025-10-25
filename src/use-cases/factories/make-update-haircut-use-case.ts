import { PrismaHaircutsRepository } from '@/repositories/prisma/prisma-haircuts-repository'
import { UpdateHaircutUseCase } from '../update-haircut'
import { LocalDiskStorageProvider } from '@/repositories/implementations/local-disk-storage-provider'

export function makeUpdateHaircutUseCase() {
  return new UpdateHaircutUseCase(
    new PrismaHaircutsRepository(),
    new LocalDiskStorageProvider(),
  )
}

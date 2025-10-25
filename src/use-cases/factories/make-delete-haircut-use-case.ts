import { PrismaHaircutsRepository } from '@/repositories/prisma/prisma-haircuts-repository'
import { DeleteHaircutUseCase } from '../delete-haircut'
import { LocalDiskStorageProvider } from '@/repositories/implementations/local-disk-storage-provider'

export function MakeDeleteHaircutUseCase() {
  return new DeleteHaircutUseCase(
    new PrismaHaircutsRepository(),
    new LocalDiskStorageProvider(),
  )
}

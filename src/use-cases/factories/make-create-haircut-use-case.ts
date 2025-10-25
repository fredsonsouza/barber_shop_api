import { PrismaHaircutsRepository } from '@/repositories/prisma/prisma-haircuts-repository'
import { CreateHaircutUseCase } from '../create-haircut'
import { LocalDiskStorageProvider } from '@/repositories/implementations/local-disk-storage-provider'

export function MakeCreateHaircutUseCase() {
  const storageProvider = new LocalDiskStorageProvider()
  return new CreateHaircutUseCase(
    new PrismaHaircutsRepository(),
    storageProvider,
  )
}

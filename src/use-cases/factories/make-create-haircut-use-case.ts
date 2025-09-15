import { PrismaHaircutsRepository } from '@/repositories/prisma/prisma-haircuts-repository'
import { CreateHaircutUseCase } from '../create-haircut'

export function MakeCreateHaircutUseCase() {
  return new CreateHaircutUseCase(new PrismaHaircutsRepository())
}

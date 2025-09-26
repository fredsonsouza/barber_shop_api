import { PrismaHaircutsRepository } from '@/repositories/prisma/prisma-haircuts-repository'
import { UpdateHaircutUseCase } from '../update-haircut'

export function makeUpdateHaircutUseCase() {
  return new UpdateHaircutUseCase(new PrismaHaircutsRepository())
}

import { PrismaHaircutsRepository } from '@/repositories/prisma/prisma-haircuts-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ToggleFavoriteHaircutUseCase } from '../toggle-favorite-haircut'

export function makeToggleFavoriteHaircutUseCase() {
  return new ToggleFavoriteHaircutUseCase(
    new PrismaUsersRepository(),
    new PrismaHaircutsRepository(),
  )
}

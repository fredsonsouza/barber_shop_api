import { PrismaHaircutsRepository } from '@/repositories/prisma/prisma-haircuts-repository'
import { ChooseFavoriteHaircutUseCase } from '../choose-favorite-haircut'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeChooseFavoriteHaircutUseCase() {
  return new ChooseFavoriteHaircutUseCase(
    new PrismaUsersRepository(),
    new PrismaHaircutsRepository(),
  )
}

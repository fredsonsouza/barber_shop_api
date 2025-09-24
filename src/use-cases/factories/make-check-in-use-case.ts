import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { CheckInUseCase } from '../check-in'
import { PrismaBarberShopsRepository } from '@/repositories/prisma/prisma-barber-shops-repository'
import { PrismaHaircutsRepository } from '@/repositories/prisma/prisma-haircuts-repository'

export function makeCheckInUseCase() {
  return new CheckInUseCase(
    new PrismaCheckInsRepository(),
    new PrismaBarberShopsRepository(),
    new PrismaHaircutsRepository(),
  )
}

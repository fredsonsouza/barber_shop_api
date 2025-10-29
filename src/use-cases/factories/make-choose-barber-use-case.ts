import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaBarberCustomersRepository } from '@/repositories/prisma/prisma-barber-customers-repository'
import { ChooseBarberUseCase } from '../choose-barber'

export function makeChooseBarberUseCase() {
  return new ChooseBarberUseCase(
    new PrismaUsersRepository(),
    new PrismaBarberCustomersRepository(),
  )
}

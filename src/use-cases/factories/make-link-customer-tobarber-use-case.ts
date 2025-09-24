import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { LinkCustomerToBarberUseCase } from '../link-customer-to-barber'
import { PrismaBarberCustomersRepository } from '@/repositories/prisma/prisma-barber-customers-repository'

export function makeLinkCustomerToBarberUseCase() {
  return new LinkCustomerToBarberUseCase(
    new PrismaUsersRepository(),
    new PrismaBarberCustomersRepository(),
  )
}

import { PrismaBarberShopsRepository } from '@/repositories/prisma/prisma-barber-shops-repository'
import { CreateBarberShopUseCase } from '../create-barber-shop'

export function makeCreateBarberShopUseCase() {
  return new CreateBarberShopUseCase(new PrismaBarberShopsRepository())
}

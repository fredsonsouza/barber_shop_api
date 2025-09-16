import { BarberShop, Prisma } from 'generated/prisma'

export interface BarberShopsRepository {
  create(data: Prisma.BarberShopCreateInput): Promise<BarberShop>
}

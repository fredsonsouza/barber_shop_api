import { BarberShop, Prisma } from 'generated/prisma'

export interface BarberShopsRepository {
  findById(id: string): Promise<BarberShop | null>
  create(data: Prisma.BarberShopCreateInput): Promise<BarberShop>
}

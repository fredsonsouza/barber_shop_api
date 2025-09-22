import { BarberShop, Prisma } from 'generated/prisma'
import { BarberShopsRepository } from '../barber-shops-repository'
import { prisma } from '@/lib/prisma'

export class PrismaBarberShopsRepository implements BarberShopsRepository {
  async findById(id: string) {
    const barberShop = await prisma.barberShop.findUnique({
      where: {
        id,
      },
    })
    return barberShop
  }
  async create(data: Prisma.BarberShopCreateInput) {
    const barberShop = await prisma.barberShop.create({ data })

    return barberShop
  }
}

import { Prisma, BarberShop } from 'generated/prisma'
import { BarberShopsRepository } from '../barber-shops-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryBarberShopsRepository implements BarberShopsRepository {
  public items: BarberShop[] = []

  async findById(id: string) {
    const barberShopId = this.items.find((barberShop) => barberShop.id === id)

    if (!barberShopId) {
      return null
    }
    return barberShopId
  }

  async create(data: Prisma.BarberShopCreateInput) {
    const barberShop = {
      id: data.id ?? randomUUID(),
      title: data.title,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }
    this.items.push(barberShop)

    return barberShop
  }
}

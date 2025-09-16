import { Prisma, BarberShop } from 'generated/prisma'
import { BarberShopsRepository } from '../barber-shops-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryBarberShopsRepository implements BarberShopsRepository {
  public items: BarberShop[] = []

  async create(data: Prisma.BarberShopCreateInput) {
    const barberShop = {
      id: randomUUID(),
      title: data.title,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }
    this.items.push(barberShop)

    return barberShop
  }
}

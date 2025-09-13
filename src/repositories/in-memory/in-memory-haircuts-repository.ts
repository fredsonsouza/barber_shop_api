import { Haircut, Prisma } from 'generated/prisma'
import { HaircutsRepository } from '../haircuts-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryHaircutsRepository implements HaircutsRepository {
  public items: Haircut[] = []
  async findByName(name: string) {
    const haircut = this.items.find((haircut) => haircut.name === name)

    if (!haircut) {
      return null
    }
    return haircut
  }
  async create(data: Prisma.HaircutCreateInput) {
    const haircut = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      price: new Prisma.Decimal(data.price.toString()),
    }
    this.items.push(haircut)

    return haircut
  }
}

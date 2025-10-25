import { Haircut, Prisma } from 'generated/prisma'
import { HaircutsRepository, UpdateHaircutParams } from '../haircuts-repository'
import { randomUUID } from 'node:crypto'
import { Decimal } from 'generated/prisma/runtime/library'

export class InMemoryHaircutsRepository implements HaircutsRepository {
  public items: Haircut[] = []

  async findById(id: string) {
    const haircut = this.items.find((haircut) => haircut.id === id)

    return haircut ?? null
  }

  async findByName(name: string) {
    const haircut = this.items.find((haircut) => haircut.name === name)

    return haircut ?? null
  }

  async update(id: string, params: UpdateHaircutParams) {
    const haircutIndex = this.items.findIndex((item) => item.id === id)

    if (haircutIndex === -1) return null

    const haircut = this.items[haircutIndex]!

    if (params.name !== undefined) haircut.name = params.name
    if (params.description !== undefined)
      haircut.description = params.description
    if (params.price !== undefined) haircut.price = new Decimal(params.price)
    if (params.imageUrl !== undefined) haircut.image_url = params.imageUrl

    return haircut
  }

  async create(data: Prisma.HaircutCreateInput) {
    const haircut = {
      id: data.id ?? randomUUID(),
      name: data.name,
      image_url: data.image_url,
      description: data.description,
      price: new Prisma.Decimal(data.price.toString()),
      created_at: new Date(),
      updated_at: data.updated_at ? new Date(data.updated_at) : new Date(),
    }

    this.items.push(haircut)

    return haircut
  }
  async delete(id: string) {
    const haircutIndex = this.items.findIndex((item) => item.id === id)

    if (haircutIndex > -1) {
      this.items.splice(haircutIndex, 1)
    }
  }
}

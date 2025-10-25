import { Haircut, Prisma } from 'generated/prisma'
import { HaircutsRepository, UpdateHaircutParams } from '../haircuts-repository'
import { prisma } from '@/lib/prisma'

export class PrismaHaircutsRepository implements HaircutsRepository {
  async findById(id: string) {
    const haircutId = await prisma.haircut.findUnique({
      where: {
        id,
      },
    })
    return haircutId
  }
  async update(id: string, params: UpdateHaircutParams) {
    const haircut = await prisma.haircut.update({
      where: {
        id,
      },
      data: {
        ...(params.name !== undefined && { name: params.name }),
        ...(params.description !== undefined && {
          description: params.description,
        }),
        ...(params.price !== undefined && { price: params.price }),
        ...(params.imageUrl !== undefined && { image_url: params.imageUrl }),
      },
    })
    return haircut
  }

  async findByName(name: string) {
    const haircut = await prisma.haircut.findFirst({
      where: {
        name,
      },
    })
    return haircut
  }
  async create(data: Prisma.HaircutCreateInput) {
    const haircut = await prisma.haircut.create({ data })

    return haircut
  }
  async delete(id: string) {
    await prisma.haircut.delete({
      where: {
        id,
      },
    })
  }
}

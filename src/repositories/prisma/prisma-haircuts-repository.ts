import { Haircut, Prisma } from 'generated/prisma'
import { HaircutsRepository, UpdateHaircutParams } from '../haircuts-repository'
import { prisma } from '@/lib/prisma'

export class PrismaHaircutsRepository implements HaircutsRepository {
  findById(id: string): Promise<Haircut | null> {
    throw new Error('Method not implemented.')
  }
  update(id: string, params: UpdateHaircutParams): Promise<Haircut | null> {
    throw new Error('Method not implemented.')
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
}

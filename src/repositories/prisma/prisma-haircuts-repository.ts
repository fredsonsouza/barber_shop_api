import { Haircut, Prisma } from 'generated/prisma'
import { HaircutsRepository } from '../haircuts-repository'
import { prisma } from '@/lib/prisma'

export class PrismaHaircutsRepository implements HaircutsRepository {
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

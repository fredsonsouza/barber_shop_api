import { Prisma } from 'generated/prisma'
import { UsersRepository } from '../users-repository'
import { prisma } from '@/lib/prisma'

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })
    return user
  }
  async findById(id: string) {
    const userId = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    return userId
  }
  toggleFavoriteHaircut(userId: string, haircutId: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })
    return user
  }
}

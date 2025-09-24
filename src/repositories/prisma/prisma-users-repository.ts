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
  async toggleFavoriteHaircut(userId: string, haircutId: string) {
    const existing = await prisma.userFavoriteHaircut.findUnique({
      where: {
        user_id_haircut_id: { user_id: userId, haircut_id: haircutId },
      },
    })
    if (existing) {
      await prisma.userFavoriteHaircut.delete({
        where: {
          user_id_haircut_id: { user_id: userId, haircut_id: haircutId },
        },
      })
      return false
    } else {
      await prisma.userFavoriteHaircut.create({
        data: {
          user_id: userId,
          haircut_id: haircutId,
        },
      })
      return true
    }
  }
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })
    return user
  }
}

import { Prisma, User } from 'generated/prisma'

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  toggleFavoriteHaircut(userId: string, haircutId: string): Promise<boolean>
  create(data: Prisma.UserCreateInput): Promise<User>
}

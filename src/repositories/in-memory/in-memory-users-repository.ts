import { User, Prisma, Haircut } from 'generated/prisma'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []
  public userFavorites: Record<string, string[]> = {}

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email)
    if (!user) {
      return null
    }
    return user
  }

  async findById(id: string) {
    const user = this.items.find((user) => user.id === id)
    if (!user) {
      return null
    }
    return user
  }

  async toggleFavoriteHaircut(userId: string, haircutId: string) {
    if (!this.userFavorites[userId]) {
      this.userFavorites[userId] = []
    }
    const favorites = this.userFavorites[userId]

    if (favorites.includes(haircutId)) {
      this.userFavorites[userId] = favorites.filter((id) => id !== haircutId)
      return false
    } else {
      favorites.push(haircutId)
      return true
    }
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      role: data.role ?? 'CUSTOMER',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      sex: data.sex,
      birth_date: new Date(),
      phone: data.phone ?? null,
      created_at: new Date(),
    }
    this.items.push(user)
    return user
  }
}

import { User, Prisma } from 'generated/prisma'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email)
    if (!user) {
      return null
    }
    return user
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

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUserUseCase() {
  return new RegisterUseCase(new PrismaUsersRepository())
}

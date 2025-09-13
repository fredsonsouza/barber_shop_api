import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { User } from 'generated/prisma'
import { UserAlreadyExistsError } from './error/user-already-exists-error'

export interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
  birthDate: Date
  sex: string
  phone?: string
}

export interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    birthDate,
    sex,
    phone,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: password,
      birth_date: birthDate,
      sex,
      phone,
    })

    return { user }
  }
}

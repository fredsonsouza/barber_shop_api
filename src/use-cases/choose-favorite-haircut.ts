import { HaircutsRepository } from '@/repositories/haircuts-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { Haircut, User } from 'generated/prisma'
import { ResourceNotFoundError } from './error/resource-not-found-error'

export interface ChooseFavoriteHaircutUseCaseRequest {
  userId: string
  haircutId: string
}
export interface ChooseFavoriteHaircutUseCaseResponse {
  user: User
  haircut: Haircut
  favorited: boolean
}

export class ChooseFavoriteHaircutUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private haircutsRepository: HaircutsRepository,
  ) {}

  async execute({
    userId,
    haircutId,
  }: ChooseFavoriteHaircutUseCaseRequest): Promise<ChooseFavoriteHaircutUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const haircut = await this.haircutsRepository.findById(haircutId)

    if (!haircut) {
      throw new ResourceNotFoundError()
    }
    const favorited = await this.usersRepository.toggleFavoriteHaircut(
      userId,
      haircutId,
    )

    return { user, haircut, favorited }
  }
}

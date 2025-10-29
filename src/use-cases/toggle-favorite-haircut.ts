import { HaircutsRepository } from '@/repositories/haircuts-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { Haircut, User } from 'generated/prisma'
import { ResourceNotFoundError } from './error/resource-not-found-error'

export interface ToggleFavoriteHaircutUseCaseRequest {
  userId: string
  haircutId: string
}
export interface ToggleFavoriteHaircutUseCaseResponse {
  user: User
  haircut: Haircut
  favorited: boolean
}

export class ToggleFavoriteHaircutUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private haircutsRepository: HaircutsRepository,
  ) {}

  async execute({
    userId,
    haircutId,
  }: ToggleFavoriteHaircutUseCaseRequest): Promise<ToggleFavoriteHaircutUseCaseResponse> {
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

import { HaircutsRepository } from '@/repositories/haircuts-repository'
import { Haircut } from 'generated/prisma'
import { ResourceNotFoundError } from './error/resource-not-found-error'

export interface UpdateHaircutUseCaseRequest {
  id: string
  name?: string
  description?: string
  price?: number
}
export interface UpdateHaircutUseCaseResponse {
  updatedHaircut: Haircut
}

export class UpdateHaircutUseCase {
  constructor(private haircutRepository: HaircutsRepository) {}

  async execute({
    id,
    name,
    description,
    price,
  }: UpdateHaircutUseCaseRequest): Promise<UpdateHaircutUseCaseResponse> {
    const haircutId = await this.haircutRepository.findById(id)

    if (!haircutId) {
      throw new ResourceNotFoundError()
    }

    const updatedHaircut = await this.haircutRepository.update(id, {
      name,
      description,
      price,
    })

    if (!updatedHaircut) {
      throw new ResourceNotFoundError()
    }

    return { updatedHaircut }
  }
}

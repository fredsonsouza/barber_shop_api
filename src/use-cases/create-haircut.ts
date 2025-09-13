import { HaircutsRepository } from '@/repositories/haircuts-repository'
import { Haircut } from 'generated/prisma'
import { HaircutAlreadyExistsError } from './error/haircut-already-exists-error'

export interface CreateHaircutUseCaseRequest {
  name: string
  description: string
  price: number
}
export interface CreateHaircutUseCaseResponse {
  haircut: Haircut
}
export class CreateHaircutUseCase {
  constructor(private haircutsRepository: HaircutsRepository) {}

  async execute({
    name,
    description,
    price,
  }: CreateHaircutUseCaseRequest): Promise<CreateHaircutUseCaseResponse> {
    const haircutWithSameName = await this.haircutsRepository.findByName(name)

    if (haircutWithSameName) {
      throw new HaircutAlreadyExistsError()
    }
    const haircut = await this.haircutsRepository.create({
      name,
      description,
      price,
    })
    return { haircut }
  }
}

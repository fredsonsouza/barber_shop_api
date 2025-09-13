import { HaircutsRepository } from '@/repositories/haircuts-repository'
import { Haircut } from 'generated/prisma'
import { HaircutAlreadyExistsError } from './error/haircut-already-exists-error'

export interface HaircutUseCaseRequest {
  name: string
  description: string
  price: number
}
export interface HaircutUseCaseResponse {
  haircut: Haircut
}
export class HaircutUseCase {
  constructor(private haircutsRepository: HaircutsRepository) {}

  async execute({
    name,
    description,
    price,
  }: HaircutUseCaseRequest): Promise<HaircutUseCaseResponse> {
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

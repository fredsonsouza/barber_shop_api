import { BarberShopsRepository } from '@/repositories/barber-shops-repository'
import { BarberShop } from 'generated/prisma'

export interface CreateBarberShopUseCaseRequest {
  title: string
  phone: string | null
  latitude: number
  longitude: number
}
export interface CreateBarberShopUseCaseResponse {
  barberShop: BarberShop
}

export class CreateBarberShopUseCase {
  constructor(private barberShopsRepository: BarberShopsRepository) {}

  async execute({
    title,
    phone,
    latitude,
    longitude,
  }: CreateBarberShopUseCaseRequest): Promise<CreateBarberShopUseCaseResponse> {
    const barberShop = await this.barberShopsRepository.create({
      title,
      phone,
      latitude,
      longitude,
    })
    return { barberShop }
  }
}

import { BarberShopsRepository } from '@/repositories/barber-shops-repository'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from 'generated/prisma'
import { ResourceNotFoundError } from './error/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './error/max-distance-error'
import { MaxNumberCheckInsError } from './error/max-number-of-check-ins-error'

export interface CheckInUseCaseRequest {
  userId: string
  barberShopId: string
  userLatitude: number
  userLongitude: number
}

export interface CheckInUseCaseResponse {
  checkIn: CheckIn
}
export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private barberShopsRepository: BarberShopsRepository,
  ) {}

  async execute({
    userId,
    barberShopId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const barberShop = await this.barberShopsRepository.findById(barberShopId)

    if (!barberShop) {
      throw new ResourceNotFoundError()
    }
    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: barberShop.latitude.toNumber(),
        longitude: barberShop.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumberCheckInsError()
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      barber_shop_id: barberShopId,
    })

    return { checkIn }
  }
}

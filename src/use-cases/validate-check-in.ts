import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from 'generated/prisma'
import { ResourceNotFoundError } from './error/resource-not-found-error'
import dayjs from 'dayjs'

interface ValidateCheckInUsecaseRequest {
  checkInId: string
}

interface ValidateCheckInUsecaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUsecase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUsecaseRequest): Promise<ValidateCheckInUsecaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new Error()
    }
    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}

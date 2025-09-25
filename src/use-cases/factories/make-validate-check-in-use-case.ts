import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInUsecase } from '../validate-check-in'

export function makeValidationCheckInUseCase() {
  return new ValidateCheckInUsecase(new PrismaCheckInsRepository())
}

import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetBarberMetricsUseCase } from '../get-barber-metrics'

export function makeGetUserBarberMetricsUseCase() {
  return new GetBarberMetricsUseCase(new PrismaCheckInsRepository())
}

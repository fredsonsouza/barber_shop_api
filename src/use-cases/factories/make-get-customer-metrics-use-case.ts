import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetCustomerMetricsUseCase } from '../get-customer-metrics'

export function makeGetUserCustomerMetricsUseCase() {
  return new GetCustomerMetricsUseCase(new PrismaCheckInsRepository())
}

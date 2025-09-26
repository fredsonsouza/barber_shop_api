import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetCustomerMtricsUseCase } from '../get-customer-metrics'

export function makeGetUserCustomerMetricsUseCase() {
  return new GetCustomerMtricsUseCase(new PrismaCheckInsRepository())
}

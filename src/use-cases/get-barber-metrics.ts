import type { CheckInsRepository } from '@/repositories/check-ins-repository'

interface MostFrequentCustomer {
  customerId: string
  customerName: string
  count: number
}

interface MostFrequentHaircut {
  haircutId: string
  haircutName: string
  count: number
}

interface GetBarberMetricsUseCaseRequest {
  barberId: string
}

interface GetBarberMetricsUseCaseResponse {
  totalCheckIns: number
  totalRevenue: number
  mostFrequentCustomer: MostFrequentCustomer | null
  mostFrequentHaircut: MostFrequentHaircut | null
}

export class GetBarberMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    barberId,
  }: GetBarberMetricsUseCaseRequest): Promise<GetBarberMetricsUseCaseResponse> {
    const totalCheckIns =
      await this.checkInsRepository.countByBarberId(barberId)

    const totalRevenue =
      await this.checkInsRepository.totalRevenueByBarber(barberId)

    const mostFrequentCustomer =
      await this.checkInsRepository.findMostFrequentCustomerByBarber(barberId)

    const mostFrequentHaircut =
      await this.checkInsRepository.findMostFrequentHaircutByBarber(barberId)
    return {
      totalCheckIns,
      totalRevenue,
      mostFrequentCustomer,
      mostFrequentHaircut,
    }
  }
}

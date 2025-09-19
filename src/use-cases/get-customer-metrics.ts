import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetCustomerMtricsUseCaseRequest {
  userCustomerId: string
}

interface GetCustomerMtricsUseCaseResponse {
  checkInsCount: number
  totalSpent: number
  favoriteHaircut: {
    haircutId: string
    haircutName: string
    barberId: string
    barberName: string
    count: number
  } | null
}
export class GetCustomerMtricsUseCase {
  constructor(private checkInsrepository: CheckInsRepository) {}

  async execute({
    userCustomerId,
  }: GetCustomerMtricsUseCaseRequest): Promise<GetCustomerMtricsUseCaseResponse> {
    const checkInsCount =
      await this.checkInsrepository.counterByUserId(userCustomerId)

    const totalSpent =
      await this.checkInsrepository.totalSpentByUserCustomerId(userCustomerId)

    const favoriteHaircut =
      await this.checkInsrepository.favoriteHaircutByUserCustomerId(
        userCustomerId,
      )

    return { checkInsCount, totalSpent, favoriteHaircut }
  }
}

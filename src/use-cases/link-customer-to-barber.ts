import { BarberCustomersRepository } from '@/repositories/barber-customers-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { InvalidUserRoleError } from './error/invalid-user-role-error'
import { DuplicateLinkCustomerToBarberError } from './error/duplicate-link-customer-to-barber-error'

export interface LinkCustomerToBarberUseCaseRequest {
  userAsCustomerId: string
  userAsBarberId: string
}
export interface LinkCustomerToBarberUseCaseResponse {
  link: {
    userAsCustomerId: string
    userAsBarberId: string
  }
}
export class LinkCustomerToBarberUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private barberCustomersRepository: BarberCustomersRepository,
  ) {}

  async execute({
    userAsCustomerId,
    userAsBarberId,
  }: LinkCustomerToBarberUseCaseRequest): Promise<LinkCustomerToBarberUseCaseResponse> {
    const barber = await this.usersRepository.findById(userAsBarberId)

    if (barber?.role !== 'BARBER') {
      throw new InvalidUserRoleError()
    }
    const existingLink =
      await this.barberCustomersRepository.findByBarberAndCustomer(
        userAsBarberId,
        userAsCustomerId,
      )

    if (existingLink) {
      throw new DuplicateLinkCustomerToBarberError()
    }

    const link = await this.barberCustomersRepository.create({
      userAsBarberId,
      userAsCustomerId,
    })

    return {
      link: {
        userAsBarberId: link.user_barber_id,
        userAsCustomerId: link.user_customer_id,
      },
    }
  }
}

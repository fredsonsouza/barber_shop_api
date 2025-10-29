import { BarberCustomersRepository } from '@/repositories/barber-customers-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { InvalidUserRoleError } from './error/invalid-user-role-error'
import { DuplicateChooseBarberError } from './error/duplicate-choose-barber-error'

export interface ChooseBarberUseCaseRequest {
  userAsCustomerId: string
  userAsBarberId: string
}
export interface ChooseBarberUseCaseResponse {
  connection: {
    userAsCustomerId: string
    userAsBarberId: string
  }
}
export class ChooseBarberUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private barberCustomersRepository: BarberCustomersRepository,
  ) {}

  async execute({
    userAsCustomerId,
    userAsBarberId,
  }: ChooseBarberUseCaseRequest): Promise<ChooseBarberUseCaseResponse> {
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
      throw new DuplicateChooseBarberError()
    }

    const connection = await this.barberCustomersRepository.create({
      userAsBarberId,
      userAsCustomerId,
    })

    return {
      connection: {
        userAsBarberId: connection.user_barber_id,
        userAsCustomerId: connection.user_customer_id,
      },
    }
  }
}

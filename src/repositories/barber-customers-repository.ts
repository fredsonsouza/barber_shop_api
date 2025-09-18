import { BarberCustomer } from 'generated/prisma'

export interface BarberCustomersRepository {
  create(data: {
    userAsBarberId: string
    userAsCustomerId: string
  }): Promise<BarberCustomer>
  findBarberById(barberId: string): Promise<BarberCustomer[] | null>
  findByBarberAndCustomer(
    barberId: string,
    customerId: string,
  ): Promise<BarberCustomer | null>
}

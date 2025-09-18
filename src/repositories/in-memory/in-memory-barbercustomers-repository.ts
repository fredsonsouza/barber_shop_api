import { BarberCustomer } from 'generated/prisma'
import { BarberCustomersRepository } from '../barber-customers-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryBarberCustomersRepository
  implements BarberCustomersRepository
{
  public items: BarberCustomer[] = []

  async findBarberById(barberId: string) {
    return this.items.filter((item) => item.user_barber_id === barberId) ?? null
  }

  async findByBarberAndCustomer(barberId: string, customerId: string) {
    return (
      this.items.find(
        (item) =>
          item.user_barber_id === barberId &&
          item.user_customer_id === customerId,
      ) ?? null
    )
  }

  async create(data: { userAsBarberId: string; userAsCustomerId: string }) {
    const link: BarberCustomer = {
      id: randomUUID(),
      user_barber_id: data.userAsBarberId,
      user_customer_id: data.userAsCustomerId,
    }
    this.items.push(link)
    return link
  }
}

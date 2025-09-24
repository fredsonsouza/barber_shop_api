import { BarberCustomer } from 'generated/prisma'
import { BarberCustomersRepository } from '../barber-customers-repository'
import { prisma } from '@/lib/prisma'

export class PrismaBarberCustomersRepository
  implements BarberCustomersRepository
{
  async create(data: { userAsBarberId: string; userAsCustomerId: string }) {
    const link = await prisma.barberCustomer.create({
      data: {
        user_customer_id: data.userAsCustomerId,
        user_barber_id: data.userAsBarberId,
      },
    })
    return link
  }

  async findBarberById(barberId: string) {
    const links = await prisma.barberCustomer.findMany({
      where: {
        user_barber_id: barberId,
      },
    })
    return links.length > 0 ? links : null
  }

  async findByBarberAndCustomer(barberId: string, customerId: string) {
    const link = await prisma.barberCustomer.findFirst({
      where: {
        user_barber_id: barberId,
        user_customer_id: customerId,
      },
    })
    return link
  }
}

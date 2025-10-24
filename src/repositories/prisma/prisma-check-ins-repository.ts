import { CheckIn, Prisma } from 'generated/prisma'
import { CheckInsRepository } from '../check-ins-repository'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async countByBarberId(barberId: string) {
    const count = await prisma.checkIn.count({
      where: {
        barber_id: barberId,
      },
    })
    return count
  }
  async totalRevenueByBarber(barberId: string) {
    const result = await prisma.checkIn.aggregate({
      _sum: {
        price: true,
      },
      where: {
        barber_id: barberId,
      },
    })

    return result._sum.price?.toNumber() ?? 0
  }
  async findMostFrequentCustomerByBarber(barberId: string) {
    const results = await prisma.checkIn.groupBy({
      by: ['user_id'],
      where: {
        barber_id: barberId,
      },
      _count: {
        user_id: true,
      },
      orderBy: {
        _count: {
          user_id: 'desc',
        },
      },
      take: 1,
    })
    const mostFrequent = results[0]

    if (!mostFrequent) {
      return null
    }
    const customer = await prisma.user.findUnique({
      where: {
        id: mostFrequent.user_id,
      },
    })
    if (!customer) {
      return null
    }
    return {
      customerId: customer.id,
      customerName: customer.name,
      count: mostFrequent._count.user_id,
    }
  }
  async findMostFrequentHaircutByBarber(barberId: string) {
    const results = await prisma.checkIn.groupBy({
      by: ['haircut_id'],
      where: {
        barber_id: barberId,
        haircut_id: {
          not: undefined, // Ignora check-ins sem um corte associado
        },
      },
      _count: {
        haircut_id: true,
      },
      orderBy: {
        _count: {
          haircut_id: 'desc',
        },
      },
      take: 1,
    })

    const mostFrequent = results[0]

    if (!mostFrequent || !mostFrequent.haircut_id) {
      return null
    }

    // 2. Busca os dados do corte
    const haircut = await prisma.haircut.findUnique({
      where: {
        id: mostFrequent.haircut_id,
      },
    })

    if (!haircut) {
      return null // Corte não encontrado
    }

    return {
      haircutId: haircut.id,
      haircutName: haircut.name,
      count: mostFrequent._count.haircut_id,
    }
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })
    return checkIn
  }

  async findById(id: string) {
    return await prisma.checkIn.findUnique({
      where: { id },
    })
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({ data })

    return checkIn
  }
  async counterByUserId(userCustomerId: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userCustomerId,
      },
    })
    return count
  }

  async totalSpentByUserCustomerId(userCustomerId: string) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userCustomerId,
      },
      select: { price: true },
    })
    return checkIns.reduce((acc, curr) => acc + Number(curr.price), 0)
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })
    return checkIn
  }

  async favoriteHaircutByUserCustomerId(userCustomerId: string) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userCustomerId,
      },
      include: {
        haircut: true,
        barber: true,
      },
    })

    if (checkIns.length === 0) return null

    const map = new Map<
      string,
      {
        haircutId: string
        haircutName: string
        barberId: string
        barberName: string
        count: number
      }
    >()

    for (const checkIn of checkIns) {
      if (!checkIn.haircut_id || !checkIn.barber_id) continue

      const key = `${checkIn.haircut_id}-${checkIn.barber_id}`

      if (!map.has(key)) {
        map.set(key, {
          haircutId: checkIn.haircut_id,
          haircutName: checkIn.haircut.name,
          barberId: checkIn.barber.id,
          barberName: checkIn.barber.name,
          count: 1,
        })
      } else {
        map.get(key)!.count += 1
      }
    }

    let favorite: {
      haircutId: string
      haircutName: string
      barberId: string
      barberName: string
      count: number
    } | null = null

    for (const [, value] of map.entries()) {
      if (!favorite || value.count > favorite.count) {
        favorite = value
      }
    }
    return favorite
  }
}

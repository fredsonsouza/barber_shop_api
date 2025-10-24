import { CheckIn, Haircut, Prisma, User } from 'generated/prisma'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []
  public users: User[] = []
  public haircuts: Haircut[] = []

  async countByBarberId(barberId: string) {
    return this.items.filter((item) => item.barber_id === barberId).length
  }

  async totalRevenueByBarber(barberId: string) {
    const barberCheckIns = this.items.filter(
      (item) => item.barber_id === barberId,
    )

    const totalRevenue = barberCheckIns.reduce(
      (acc, checkIn) => acc + Number(checkIn.price),
      0,
    )

    return totalRevenue
  }

  async findMostFrequentCustomerByBarber(barberId: string) {
    const barberCheckIns = this.items.filter(
      (item) => item.barber_id === barberId,
    )

    if (barberCheckIns.length === 0) {
      return null
    }

    const customerCounts: Record<string, number> = {}
    for (const checkIn of barberCheckIns) {
      customerCounts[checkIn.user_id] =
        (customerCounts[checkIn.user_id] || 0) + 1
    }

    let mostFrequentCustomerId: string | null = null
    let maxCount = 0

    for (const [customerId, count] of Object.entries(customerCounts)) {
      if (count > maxCount) {
        maxCount = count
        mostFrequentCustomerId = customerId
      }
    }

    if (!mostFrequentCustomerId) {
      return null
    }

    const customer = this.users.find(
      (user) => user.id === mostFrequentCustomerId,
    )
    if (!customer) {
      return null
    }
    return {
      customerId: customer.id,
      customerName: customer.name,
      count: maxCount,
    }
  }
  async findMostFrequentHaircutByBarber(barberId: string) {
    const barberCheckIns = this.items.filter(
      (item) => item.barber_id === barberId,
    )

    if (barberCheckIns.length === 0) {
      return null
    }

    const haircutCounts: Record<string, number> = {}
    for (const checkIn of barberCheckIns) {
      if (checkIn.haircut_id) {
        haircutCounts[checkIn.haircut_id] =
          (haircutCounts[checkIn.haircut_id] || 0) + 1
      }
    }

    if (Object.keys(haircutCounts).length === 0) {
      return null
    }

    let mostFrequentHaircutId: string | null = null
    let maxCount = 0

    for (const [haircutId, count] of Object.entries(haircutCounts)) {
      if (count > maxCount) {
        maxCount = count
        mostFrequentHaircutId = haircutId
      }
    }

    if (!mostFrequentHaircutId) {
      return null
    }

    const haircut = this.haircuts.find((h) => h.id === mostFrequentHaircutId)

    if (!haircut) {
      return null // Inconsistência de dados, corte de cabelo não encontrado
    }

    return {
      haircutId: haircut.id,
      haircutName: haircut.name,
      count: maxCount,
    }
  }

  async findById(id: string) {
    return this.items.find((checkIn) => checkIn.id === id) ?? null
  }

  async totalSpentByUserCustomerId(userCustomerId: string) {
    const user = this.users.find((user) => user.id === userCustomerId)

    if (!user || user.role !== 'CUSTOMER') {
      return 0
    }
    return this.items
      .filter((item) => item.user_id == userCustomerId)
      .reduce((acc, curr) => acc + Number(curr.price), 0)
  }
  async favoriteHaircutByUserCustomerId(userCustomerId: string) {
    // 1. Verifica se o usuário existe e é CUSTOMER
    const user = this.users.find((u) => u.id === userCustomerId)
    if (!user || user.role !== 'CUSTOMER') return null

    // 2. Filtra os check-ins do usuário
    const userCheckIns = this.items.filter(
      (checkIn) => checkIn.user_id === userCustomerId,
    )
    if (userCheckIns.length === 0) return null

    // 3. Cria um mapa para contar quantas vezes cada haircut foi feito e por qual barber
    const haircutMap: Record<
      string,
      { totalCount: number; barberMap: Record<string, number> }
    > = {}
    for (const checkIn of userCheckIns) {
      // Garante que os campos existem
      if (!checkIn.haircut_id || !checkIn.barber_id) continue

      if (!haircutMap[checkIn.haircut_id]) {
        haircutMap[checkIn.haircut_id] = {
          totalCount: 1,
          barberMap: { [checkIn.barber_id]: 1 },
        }
      } else {
        // Aqui garantimos que totalCount e barberMap existem
        haircutMap[checkIn.haircut_id]!.totalCount += 1
        haircutMap[checkIn.haircut_id]!.barberMap[checkIn.barber_id] =
          (haircutMap[checkIn.haircut_id]!.barberMap[checkIn.barber_id] || 0) +
          1
      }
    }

    // 4. Determina o haircut favorito
    let favoriteHaircutId: string | null = null
    let maxCount = 0
    for (const [haircutId, info] of Object.entries(haircutMap)) {
      if (info.totalCount > maxCount) {
        maxCount = info.totalCount
        favoriteHaircutId = haircutId
      }
    }
    if (!favoriteHaircutId) return null

    const favoriteHaircutInfo = haircutMap[favoriteHaircutId]
    if (!favoriteHaircutInfo) return null

    // 5. Determina o barber favorito para esse haircut
    const barberMap = favoriteHaircutInfo.barberMap
    let favoriteBarberId: string | null = null
    let barberMaxCount = 0
    for (const [barberId, count] of Object.entries(barberMap)) {
      if (count > barberMaxCount) {
        barberMaxCount = count
        favoriteBarberId = barberId
      }
    }
    if (!favoriteBarberId) return null

    // 6. Busca objetos de barber e haircut
    const favoriteHaircut = this.haircuts.find(
      (haircut) => haircut.id === favoriteHaircutId,
    )
    const favoriteBarber = this.users.find((u) => u.id === favoriteBarberId)

    if (!favoriteHaircut || !favoriteBarber) return null

    // 7. Retorna o resultado completo
    return {
      haircutId: favoriteHaircut.id,
      haircutName: favoriteHaircut.name,
      barberId: favoriteBarber.id,
      barberName: favoriteBarber.name,
      count: maxCount,
    }
  }

  async counterByUserId(userCustomerId: string) {
    const user = this.users.find((user) => user.id === userCustomerId)

    if (!user || user.role !== 'CUSTOMER') {
      return 0
    }

    return this.items.filter((item) => item.user_id == userCustomerId).length
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOsameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)

      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOsameDate) {
      return null
    }
    return checkInOsameDate
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      barber_id: data.barber_id,
      haircut_id: data.haircut_id,
      price: new Prisma.Decimal(data.price.toString()),
      barber_shop_id: data.barber_shop_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id)

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn
    }

    return checkIn
  }
}

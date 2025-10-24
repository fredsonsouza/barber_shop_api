import { CheckIn, Prisma } from 'generated/prisma'
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

export interface CheckInsRepository {
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findById(id: string): Promise<CheckIn | null>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  save(checkIn: CheckIn): Promise<CheckIn>

  counterByUserId(userCustomerId: string): Promise<number>
  totalSpentByUserCustomerId(userCustomerId: string): Promise<number>
  favoriteHaircutByUserCustomerId(userCustomerId: string): Promise<{
    haircutId: string
    haircutName: string
    barberId: string
    barberName: string
    count: number
  } | null>

  countByBarberId(barberId: string): Promise<number>
  totalRevenueByBarber(barberId: string): Promise<number>
  findMostFrequentCustomerByBarber(
    barberId: string,
  ): Promise<MostFrequentCustomer | null>
  findMostFrequentHaircutByBarber(
    barberId: string,
  ): Promise<MostFrequentHaircut | null>
}

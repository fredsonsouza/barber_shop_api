import { CheckIn, Prisma } from 'generated/prisma'

export interface CheckInsRepository {
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  counterByUserId(userCustomerId: string): Promise<number>
  totalSpentByUserCustomerId(userCustomerId: string): Promise<number>
  favoriteHaircutByUserCustomerId(userCustomerId: string): Promise<{
    haircutId: string
    haircutName: string
    barberId: string
    barberName: string
    count: number
  } | null>
}

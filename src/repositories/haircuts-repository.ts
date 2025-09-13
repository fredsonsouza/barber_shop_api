import { Haircut, Prisma } from 'generated/prisma'

export interface HaircutsRepository {
  findByName(name: string): Promise<Haircut | null>
  create(data: Prisma.HaircutCreateInput): Promise<Haircut>
}

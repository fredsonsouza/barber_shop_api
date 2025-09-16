import { Haircut, Prisma } from 'generated/prisma'

export interface UpdateHaircutParams {
  name?: string
  description?: string
  price?: number
}
export interface HaircutsRepository {
  findByName(name: string): Promise<Haircut | null>
  findById(id: string): Promise<Haircut | null>
  create(data: Prisma.HaircutCreateInput): Promise<Haircut>
  update(id: string, params: UpdateHaircutParams): Promise<Haircut | null>
}

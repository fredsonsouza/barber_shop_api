import { linkRoute } from './docs/link-barber.route'
import { FastifyTypeInstance } from '@/plugins/types'

export async function barberCustomersRoutes(app: FastifyTypeInstance) {
  app.route(linkRoute)
}

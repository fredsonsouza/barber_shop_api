import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
  isCustomer = false, // Tipo booleano mais flexível
) {
  // ...
  // Lógica de role simplificada:
  let role: 'ADMIN' | 'BARBER' | 'CUSTOMER' = 'BARBER'

  if (isAdmin) {
    role = 'ADMIN'
  } else if (isCustomer) {
    role = 'CUSTOMER'
  }
  await prisma.user.create({
    data: {
      name: 'John Snow',
      email: 'johnsnow@email.com',
      password_hash: await hash('123456', 6),
      sex: 'Male',
      birth_date: new Date(),
      role: role,
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johnsnow@email.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}

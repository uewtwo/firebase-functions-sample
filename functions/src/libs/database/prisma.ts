import { PrismaClient } from '@prisma/client'

let prismaClient: PrismaClient

function makeClient() {
  if (prismaClient) {
    return prismaClient
  }

  const _prismaClient = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

  prismaClient = _prismaClient
  return prismaClient
}
export const db = makeClient()

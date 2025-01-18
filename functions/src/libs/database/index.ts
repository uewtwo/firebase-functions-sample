import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient()
export const db = prismaClient

export type Database = PrismaClient

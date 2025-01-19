import { PrismaClient } from '@prisma/client'
import { Request } from 'express'

export interface GraphQLContext {
  req: Request
  db: PrismaClient
}

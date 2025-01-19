import { IncomingHttpHeaders } from 'node:http'
import { User } from '@mimi-api/contexts/common/entities/User'

export type AuthenticatedRequestContext = {
  headers: IncomingHttpHeaders
  user: User
}

export type NoAuthRequestContext = {
  headers: IncomingHttpHeaders
}

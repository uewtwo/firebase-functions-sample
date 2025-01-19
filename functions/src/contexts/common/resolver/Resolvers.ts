import { GraphQLContext } from '@mimi-api/contexts/common/requestContext/GraphQLContext'

export type ResolverFn<TArgs, TReturn> = (parent: unknown, args: TArgs, context: GraphQLContext) => Promise<TReturn>

export interface CreateUserInput {
  username: string
  gender?: 'male' | 'female' | 'other'
  birthDate: string
  prefectureId?: number
}

export interface CreateUserResponse {
  id: number
}

export interface User {
  id: number
  firebaseUid: string
  email: string | null
  username: string
  gender?: 'male' | 'female' | 'other'
  birthDate: Date | null
  prefectureId?: number
}

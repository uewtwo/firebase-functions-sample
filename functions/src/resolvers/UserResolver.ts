import { User } from '@mimi-api/contexts/common/entities/User'
import { GraphQLContext } from '@mimi-api/contexts/common/requestContext/GraphQLContext'
import { CreateUserInput, CreateUserResponse } from '@mimi-api/contexts/common/resolver/Resolvers'
import { UserId } from '@mimi-api/contexts/common/types/id'
import { ApiError } from '@mimi-api/libs/utils/Error'
import { z } from 'zod'
import { BaseResolver } from '../contexts/common/graphql/BaseResolver'

export class UserResolver extends BaseResolver {
  private createUserSchema = z.object({
    username: z.string().min(4),
    gender: z.enum(['male', 'female', 'other']).optional(),
    birthDate: z.string(),
    prefectureId: z.number().optional(),
  })

  Query = {
    me: async (_: unknown, __: unknown, context: GraphQLContext): Promise<User | null> => {
      const authUser = await this.verifyAuth(context)
      if (!authUser) {
        throw new ApiError(401, 'Not authorized user')
      }

      const user = await context.db.users.findUnique({
        where: { firebaseUid: authUser.firebaseUid },
      })

      if (!user) {
        throw new ApiError(404, 'User not found')
      }

      return user
    },
  }

  Mutation = {
    createUser: async (
      _: unknown,
      { input }: { input: CreateUserInput },
      context: GraphQLContext,
    ): Promise<CreateUserResponse> => {
      const authUser = await this.verifyAuth(context)
      if (!authUser) {
        throw new ApiError(401, 'Not authorized user')
      }

      const validatedInput = this.validateInput(this.createUserSchema, input)

      const record = await context.db.users.create({
        select: { id: true },
        data: {
          firebaseUid: authUser.firebaseUid,
          email: authUser.email,
          username: validatedInput.username,
          gender: validatedInput.gender,
          birthDate: validatedInput.birthDate ? new Date(validatedInput.birthDate) : null,
          prefectureId: validatedInput.prefectureId,
        },
      })

      return {
        id: UserId(record.id),
      }
    },
  }
}

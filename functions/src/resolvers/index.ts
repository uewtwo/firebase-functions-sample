import { makeExecutableSchema } from '@graphql-tools/schema'
import { CommonType } from '@mimi-api/database/schema/types/System'
import { UserType } from '@mimi-api/database/schema/types/User'
import { SystemResolver } from '@mimi-api/resolvers/SystemResolver'
import { UserResolver } from '@mimi-api/resolvers/UserResolver'

const userResolver = new UserResolver()
const systemResolver = new SystemResolver()
export const schema = makeExecutableSchema({
  typeDefs: [CommonType, UserType],
  resolvers: {
    Query: {
      ...systemResolver.Query,
      ...userResolver.Query,
    },
    Mutation: {
      ...userResolver.Mutation,
    },
  },
})

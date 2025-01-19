import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/dist/esm/express4'
import { GraphQLContext } from '@mimi-api/contexts/common/requestContext/GraphQLContext'
import { schema } from '@mimi-api/resolvers'
import cors from 'cors'
import express, { Express, json } from 'express'

export const app: Express = express()

export async function startServer() {
  const server = new ApolloServer<GraphQLContext>({
    schema,
    formatError: (formattedError, error) => {
      console.error('GraphQL Error:', error)
      if (formattedError.extensions?.code === 'BAD_USER_INPUT') {
        return {
          message: 'Validation error',
          extensions: {
            code: 'BAD_USER_INPUT',
            errors: formattedError.extensions.errors,
          },
        }
      }
      return formattedError
    },
  })

  // サーバーの起動
  await server.start()

  // ミドルウェアの設定
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => ({
        req,
        db: prisma,
      }),
    }),
  )
}

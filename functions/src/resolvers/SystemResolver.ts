import { BaseResolver } from '../contexts/common/graphql/BaseResolver'

export class SystemResolver extends BaseResolver {
  Query = {
    hello: async () => {
      return {
        message: 'Hello, World!',
      }
    },
  }
}

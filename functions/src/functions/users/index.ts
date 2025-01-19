import { requestHandlers } from '@mimi-api/controllers/requestHandlers'
import { CreateUserController } from '@mimi-api/functions/users/controllers/CreateUserController'
import { GetUserController } from '@mimi-api/functions/users/controllers/GetUserController'

export const createUser = requestHandlers({ post: new CreateUserController() })
export const getUser = requestHandlers({ get: new GetUserController() })

import { requestHandlers } from '@mimi-api/contexts/common/controllers/requestHandlers'
import { CreateUserController } from '@mimi-api/contexts/users/controllers/CreateUserController'
import { GetUserController } from '@mimi-api/contexts/users/controllers/GetUserController'

export const users = requestHandlers({ get: new GetUserController(), post: new CreateUserController() })

import { requestHandlers } from '@mimi-api/controllers/requestHandlers'
import { HelloController } from '@mimi-api/functions/system/controllers/HelloController'

export const hello = requestHandlers({ get: new HelloController() })

import { requestHandlers } from '@mimi-api/contexts/common/controllers/requestHandlers'
import { HelloController } from '@mimi-api/contexts/system/controllers/HelloController'

export const hello = requestHandlers({ get: new HelloController() })

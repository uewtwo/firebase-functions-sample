// import { openApiSpec as getProfileSpec } from '@mimi-api/functions/user/GetProfile'
import { HelloController } from '@mimi-api/contexts/system/controllers/HelloController'
import { CreateUserController } from '@mimi-api/contexts/users/controllers/CreateUserController'
import { GetUserController } from '@mimi-api/contexts/users/controllers/GetUserController'
import { IOpenApiSpec } from '@mimi-api/libs/openapi/IOpenApiSpec'

export const allSpecs: IOpenApiSpec[] = [
  // `/users`
  new CreateUserController().openApiSpec,
  // `/users/{userId or me}`
  new GetUserController().openApiSpec,

  // system
  // `/hello`
  new HelloController().openApiSpec,
]

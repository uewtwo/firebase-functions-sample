// import { openApiSpec as getProfileSpec } from '@mimi-api/functions/user/GetProfile'
import { HelloHandler } from '@mimi-api/functions/Hello'
import { GetProfileHandler } from '@mimi-api/functions/user/GetProfile'
import { IOpenApiSpec } from '@mimi-api/libs/openapi/IOpenApiSpec'

export const allSpecs: IOpenApiSpec[] = [new GetProfileHandler().openApiSpec, new HelloHandler().openApiSpec]

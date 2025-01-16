import { IOpenApiSpec } from '@mimi-api/libs/openapi/IOpenApiSpec'

export type ResCodeOf<OpenApiSpec extends IOpenApiSpec> = keyof OpenApiSpec['responses']

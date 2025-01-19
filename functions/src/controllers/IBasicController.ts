import { IOpenApiSpec } from '@mimi-api/libs/openapi/IOpenApiSpec'
import type { Response } from 'express'
import type { Request } from 'firebase-functions/v2/https'

export interface IBasicHandler {
  execute(req: Request, res: Response): Promise<void>
  readonly openApiSpec: IOpenApiSpec
}

import { User } from '@mimi-api/common/entities/User'
import { IBasicHandler } from '@mimi-api/controllers/IBasicController'
import { ReqResSchema } from '@mimi-api/controllers/types/ReqRes'
import { ErrorCodes, ErrorResBody } from '@mimi-api/libs/openapi/CommonErrorSchema'
import { IOpenApiSpec } from '@mimi-api/libs/openapi/IOpenApiSpec'
import { handleError } from '@mimi-api/utils/Error'
import type { Response } from 'express'
import type { Request } from 'firebase-functions/v2/https'

export abstract class BasicController<TRequest, TResponse, TResCode extends number> implements IBasicHandler {
  abstract openApiSpec: IOpenApiSpec

  constructor(public readonly schema: ReqResSchema) {}

  protected abstract _execute(req: TRequest, user?: User): Promise<{ status: TResCode; body: TResponse | ErrorResBody }>

  async execute(req: Request, res: Response): Promise<void> {
    const { status, body } = await this.executeContainer(req, res)
    res.status(status).json(body)
  }

  protected async executeContainer(
    req: Request,
    _res: Response,
    user?: User,
  ): Promise<{ status: TResCode | ErrorCodes; body: TResponse | ErrorResBody }> {
    try {
      const validatedRequest = this.schema.reqBody.safeParse(req)
      if (!validatedRequest.success) {
        const error: ErrorResBody = {
          error: {
            message: 'Invalid request body',
            cause: validatedRequest.error.errors,
          },
        }

        return { status: 400, body: error }
      }

      const result = await this._execute(validatedRequest.data, user)

      const validatedResponse = this.schema.resBody.safeParse(result.body)
      if (!validatedResponse.success) {
        console.error('Response validation error:', validatedResponse.error)
        const error: ErrorResBody = {
          error: {
            message: 'Internal server error',
            cause: validatedResponse.error.errors,
          },
        }

        return { status: 500, body: error }
      }

      return { status: result.status, body: validatedResponse.data }
    } catch (error) {
      const errorResponse = handleError(error)
      return { status: errorResponse.error.code as ErrorCodes, body: errorResponse }
    }
  }
}

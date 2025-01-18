import { User } from '@mimi-api/common/entities/User'
import { IBaseHandler } from '@mimi-api/handlers/IBaseHandler'
import { ReqResSchema } from '@mimi-api/handlers/types/Handler'
import { ErrorCodes, ErrorResBody } from '@mimi-api/libs/openapi/CommonErrorSchema'
import { IOpenApiSpec } from '@mimi-api/libs/openapi/IOpenApiSpec'
import { handleError } from '@mimi-api/utils/Error'
import type { Response } from 'express'
import type { Request } from 'firebase-functions/v2/https'

export abstract class BaseHandler<TRequest, TResponse, TResCode extends number>
  implements IBaseHandler<TRequest, TResponse>
{
  abstract openApiSpec: IOpenApiSpec

  constructor(public readonly schema: ReqResSchema) {}

  protected abstract handle(req: TRequest, user?: User): Promise<{ status: TResCode; body: TResponse | ErrorResBody }>

  async execute(req: Request, res: Response): Promise<void> {
    const { status, body } = await this.executeContainer(req, res)
    res.status(status).json(body)
  }

  protected async executeContainer(
    req: Request,
    res: Response,
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

      const result = await this.handle(validatedRequest.data, user)

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

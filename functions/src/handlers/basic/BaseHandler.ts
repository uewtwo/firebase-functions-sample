import { getFirebaseAdmin, initializeFirebase } from '@mimi-api/configs/Firebase'
import { IBaseHandler } from '@mimi-api/handlers/IBaseHandler'
import { ReqResSchema } from '@mimi-api/handlers/types/Handler'
import { ErrorResBody } from '@mimi-api/libs/openapi/CommonErrorSchema'
import { IOpenApiSpec } from '@mimi-api/libs/openapi/IOpenApiSpec'
import { handleError } from '@mimi-api/utils/Error'
import type { Response } from 'express'
import type { Request } from 'firebase-functions/v2/https'

export abstract class BaseHandler<TRequest, TResponse, TResCode> implements IBaseHandler<TRequest, TResponse> {
  abstract openApiSpec: IOpenApiSpec
  protected firebase: ReturnType<typeof getFirebaseAdmin>
  constructor(public readonly schema: ReqResSchema) {
    initializeFirebase()
    this.firebase = getFirebaseAdmin()
  }

  protected abstract handle(req: TRequest): Promise<{ status: TResCode; body: TResponse | ErrorResBody }>

  async execute(req: Request, res: Response): Promise<void> {
    let error: ErrorResBody
    try {
      const validatedRequest = this.schema.reqBody.safeParse(req)
      if (!validatedRequest.success) {
        error = {
          error: {
            message: 'Invalid request body',
            cause: validatedRequest.error.errors,
          },
        }
        res.status(400).json({ error })
        return
      }
      const result = await this.handle(validatedRequest.data)

      const validatedResponse = this.schema.resBody.safeParse(result.body)
      if (!validatedResponse.success) {
        console.error('Response validation error:', validatedResponse.error)
        error = {
          error: {
            message: 'Internal server error',
            cause: validatedResponse.error.errors,
          },
        }
        res.status(500).json({ error })

        return
      }

      res.json(validatedResponse.data)
    } catch (error) {
      const errorResponse = handleError(error)
      res.status(errorResponse.error.code).json(errorResponse)
    }
  }
}

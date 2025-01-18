import { User } from '@mimi-api/common/entities/User'
import { getFirebaseAdmin, initializeFirebase } from '@mimi-api/configs/Firebase'
import { BaseHandler } from '@mimi-api/handlers/basic/BaseHandler'
import { ReqResSchema } from '@mimi-api/handlers/types/Handler'
import { ErrorResBody } from '@mimi-api/libs/openapi/CommonErrorSchema'
import { ApiError } from '@mimi-api/utils/Error'
import type { Response } from 'express'
import type { Request } from 'firebase-functions/v2/https'

export abstract class AuthenticatedHandler<TRequest, TResponse, TResCode extends number> extends BaseHandler<
  TRequest,
  TResponse,
  TResCode
> {
  protected firebase: ReturnType<typeof getFirebaseAdmin>

  constructor(schema: ReqResSchema) {
    super(schema)
    initializeFirebase()
    this.firebase = getFirebaseAdmin()
  }

  private async verifyAuth(req: Request): Promise<User> {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Missing authentication token')
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await this.firebase.auth.verifyIdToken(token)

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
    }
  }

  async execute(req: Request, res: Response): Promise<void> {
    const authUser = await this.verifyAuth(req)
    const { status, body } = await this.executeContainer(req, res, authUser)
    res.status(status).json(body)
  }

  protected abstract handle(req: TRequest, user: User): Promise<{ status: TResCode; body: TResponse | ErrorResBody }>
}

import { User } from '@mimi-api/common/entities/User'
import { getFirebaseAdmin, initializeFirebase } from '@mimi-api/configs/Firebase'
import { BasicController } from '@mimi-api/controllers/basic/BasicController'
import { ReqResSchema } from '@mimi-api/controllers/types/ReqRes'
import type { Response } from 'express'
import type { Request } from 'firebase-functions/v2/https'

export abstract class AuthenticatedController<TRequest, TResponse, TResCode extends number> extends BasicController<
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

  private async verifyAuth(req: Request): Promise<User | null> {
    const authHeader = req.headers.authorization
    console.log('authHeader:', authHeader)
    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.split('Bearer ')[1]
    console.log('token:', token)
    const decodedToken = await this.firebase.auth.verifyIdToken(token)
    console.log('decodedToken:', decodedToken)
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
    }
  }

  async execute(req: Request, res: Response): Promise<void> {
    const authUser = await this.verifyAuth(req)
    if (!authUser) {
      res.status(401).json({ error: { message: 'Not authorized user' } })
      return
    }
    const { status, body } = await this.executeContainer(req, res, authUser)
    res.status(status).json(body)
  }
}

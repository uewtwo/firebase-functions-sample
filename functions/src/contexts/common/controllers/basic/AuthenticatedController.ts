import { BasicController } from '@mimi-api/contexts/common/controllers/basic/BasicController'
import { AuthenticatedRequestContext } from '@mimi-api/contexts/common/requestContext/RequestContext'
import { FirebaseUid, UserId } from '@mimi-api/contexts/common/types/id'
import type { Response } from 'express'
import type { Request } from 'firebase-functions/v2/https'

export abstract class AuthenticatedController<TRequest, TResponse, TResCode extends number> extends BasicController<
  TRequest,
  TResponse,
  TResCode
> {
  async execute(req: Request, res: Response): Promise<void> {
    const firebaseUser = await this.verifyAuth(req.headers)
    if (!firebaseUser) {
      res.status(401).json({ error: { message: 'Not authorized user' } })
      return
    }
    console.log('firebaseUser', firebaseUser)

    const userRecord = await this.db.users.findUnique({
      select: {
        id: true,
        firebaseUid: true,
        username: true,
        email: true,
        gender: true,
        Prefecture: {
          select: {
            name: true,
          },
        },
      },
      where: {
        firebaseUid: firebaseUser.firebaseUid,
      },
    })
    if (!userRecord) {
      res.status(404).json({ error: { message: 'User not found' } })
      return
    }

    const user = {
      id: UserId(userRecord.id),
      firebaseUid: FirebaseUid(firebaseUser.firebaseUid),
      username: userRecord.username,
      gender: userRecord.gender,
      email: firebaseUser.email,
      prefecture: userRecord.Prefecture?.name,
    }
    const { status, body } = await this.executeContainer(req, { headers: req.headers, user })
    res.status(status).json(body)
  }

  protected abstract _execute(
    req: TRequest,
    context: AuthenticatedRequestContext,
  ): Promise<{ status: TResCode; body: TResponse }>
}

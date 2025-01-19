// import { BasicController } from '@mimi-api/contexts/common/controllers/BasicController'
// import { User } from '@mimi-api/contexts/common/entities/User'
// import { AuthenticatedRequestContext } from '@mimi-api/contexts/common/requestContext/RequestContext'
// import { UserId } from '@mimi-api/contexts/common/types/id'
// import type { Response } from 'express'
// import type { Request } from 'firebase-functions/v2/https'

// export abstract class AuthenticatedController<TRequest, TResponse, TResCode extends number> extends BasicController<
//   TRequest,
//   TResponse,
//   TResCode
// > {
//   private async verifyAuth(req: Request): Promise<User | null> {
//     const authHeader = req.headers.authorization
//     if (!authHeader?.startsWith('Bearer ')) {
//       return null
//     }
//     const token = authHeader.split('Bearer ')[1]
//     const decodedToken = await this.firebase.auth.verifyIdToken(token)
//     return {
//       id: UserId(0), // TODO: get user id from
//       firebaseUid: decodedToken.user_id,
//       email: decodedToken.email || '', // TODO: firebase doesn't always require email
//     }
//   }

//   async execute(req: Request, res: Response): Promise<void> {
//     const authUser = await this.verifyAuth(req)
//     if (!authUser) {
//       res.status(401).json({ error: { message: 'Not authorized user' } })
//       return
//     }
//     const { status, body } = await this.executeContainer(req, authUser)
//     res.status(status).json(body)
//   }

//   protected abstract _execute(
//     req: TRequest,
//     context: AuthenticatedRequestContext,
//   ): Promise<{ status: TResCode; body: TResponse }>
// }

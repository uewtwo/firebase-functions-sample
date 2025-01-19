import { getFirebaseAdmin } from '@mimi-api/configs/Firebase'
import { User } from '@mimi-api/contexts/common/entities/User'
import { UserId } from '@mimi-api/contexts/common/types/id'

export class AuthenticatedResolver {
  protected firebase = getFirebaseAdmin()

  protected async verifyAuth(context: any): Promise<User | null> {
    const authHeader = context.req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.split('Bearer ')[1]
    try {
      const decodedToken = await this.firebase.auth.verifyIdToken(token)
      return {
        id: UserId(0), // TODO: get user id
        firebaseUid: decodedToken.user_id,
        email: decodedToken.email || '',
      }
    } catch (error) {
      return null
    }
  }
}

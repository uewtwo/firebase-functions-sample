import { getFirebaseAdmin } from '@mimi-api/configs/Firebase'
import { UserId } from '@mimi-api/contexts/common/types/id'
import { z } from 'zod'
import { User } from '../entities/User'

export class BaseResolver {
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
        id: UserId(0),
        firebaseUid: decodedToken.user_id,
        email: decodedToken.email || '',
      }
    } catch (error) {
      return null
    }
  }

  protected validateInput<T>(schema: z.ZodType<T>, input: unknown): T {
    return schema.parse(input)
  }
}

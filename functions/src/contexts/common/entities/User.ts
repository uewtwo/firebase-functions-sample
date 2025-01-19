import { FirebaseUid, UserId } from '@mimi-api/contexts/common/types/id'

export type User = {
  id: UserId
  firebaseUid: FirebaseUid
  email: string
}

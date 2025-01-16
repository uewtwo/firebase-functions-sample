import type { onRequest } from 'firebase-functions/v2/https'
import { ZodTypeAny } from 'zod'

// Desperate measures...
type OnRequestHandler = Parameters<typeof onRequest>[0]
export type ResponseType = Parameters<OnRequestHandler>[1]

// export type HandlerResponse<T> = {
//   status: number
//   body: T
// }

export type ReqResSchema = {
  pathParams: ZodTypeAny
  queryParams: ZodTypeAny
  reqBody: ZodTypeAny
  resBody: ZodTypeAny
}

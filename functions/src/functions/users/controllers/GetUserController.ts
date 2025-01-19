import { User } from '@mimi-api/common/entities/User'
import { AuthenticatedController } from '@mimi-api/controllers/basic/AuthenticatedController'
import { ResCodeOf } from '@mimi-api/controllers/types/ReqRes'
import { commonErrorSchema } from '@mimi-api/libs/openapi/CommonErrorSchema'
import { ApiError } from '@mimi-api/utils/Error'
import { z } from 'zod'

const schema = {
  pathParams: z.object({}),
  queryParams: z.object({}),
  reqBody: z.object({
    headers: z.object({
      authorization: z.string(),
    }),
  }),
  resBody: z.object({
    user: z.object({
      id: z.string(),
      displayName: z.string().optional(),
      email: z.string().optional(),
      lastLoginAt: z.string(),
    }),
  }),
}

const openApiSpec = {
  method: 'get',
  path: '/users/me',
  description: 'Get user profile',
  tags: ['User'],
  request: {
    params: schema.pathParams,
    query: schema.queryParams,
    body: {
      content: {
        'application/json': {
          schema: schema.reqBody,
        },
      },
    },
    headers: undefined,
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: schema.resBody,
        },
      },
    },
    ...commonErrorSchema,
  },
} as const

type ReqBody = z.infer<typeof schema.reqBody>
type ResBody = z.infer<typeof schema.resBody>
type ResCode = ResCodeOf<typeof openApiSpec>

// WIP
export class GetUserController extends AuthenticatedController<ReqBody, ResBody, ResCode> {
  openApiSpec = openApiSpec

  constructor() {
    super(schema)
  }

  async _execute(_req: ReqBody, authUser: User): Promise<{ status: ResCode; body: ResBody }> {
    const userDoc = await this.firebase.store.collection('users').doc(authUser.uid).get()
    if (!userDoc.exists) {
      throw new ApiError(404, 'User not found')
    }

    return {
      status: 200,
      body: {
        user: {
          id: authUser.uid,
          email: authUser.email ?? undefined,
          lastLoginAt: new Date().toISOString(),
        },
      },
    }
  }
}

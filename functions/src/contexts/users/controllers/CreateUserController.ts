import { BasicController } from '@mimi-api/contexts/common/controllers/basic/BasicController'
import { ResCodeOf } from '@mimi-api/contexts/common/controllers/types/ReqRes'
import { NoAuthRequestContext } from '@mimi-api/contexts/common/requestContext/RequestContext'
import { commonErrorSchema } from '@mimi-api/libs/openapi/CommonErrorSchema'

import { z } from 'zod'

const schema = {
  pathParams: z.object({}),
  queryParams: z.object({}),
  reqBody: z.object({
    username: z.string().min(4),
    gender: z.enum(['male', 'female', 'other']).optional(),
    birthDate: z.string().pipe(z.coerce.date()),
    prefectureId: z.number().optional(),
  }),
  resBody: z.object({}),
}

const openApiSpec = {
  method: 'post',
  path: '/users',
  description: 'Create new user',
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
    201: {
      description: 'User created successfully',
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
export class CreateUserController extends BasicController<ReqBody, ResBody, ResCode> {
  openApiSpec = openApiSpec
  constructor() {
    super(schema)
  }

  protected async _execute(req: ReqBody, context: NoAuthRequestContext): Promise<{ status: ResCode; body: ResBody }> {
    const firebaseUser = await this.verifyAuth(context.headers)
    if (!firebaseUser) {
      return {
        status: 401,
        body: { error: { message: 'Not authorized user' } },
      }
    }
    await this.db.users.create({
      data: {
        firebaseUid: firebaseUser.firebaseUid,
        email: firebaseUser.email,
        username: req.username,
        gender: req.gender || 'other',
        birthDate: req.birthDate,
        prefectureId: req.prefectureId || Math.floor(Math.random() * 47) + 1,
      },
    })

    return {
      status: 201,
      body: {},
    }
  }
}

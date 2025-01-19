import { User } from '@mimi-api/common/entities/User'
import { AuthenticatedController } from '@mimi-api/controllers/basic/AuthenticatedController'
import { ResCodeOf } from '@mimi-api/controllers/types/ReqRes'
import { db } from '@mimi-api/libs/database'
import { commonErrorSchema } from '@mimi-api/libs/openapi/CommonErrorSchema'

import { z } from 'zod'

const schema = {
  pathParams: z.object({}),
  queryParams: z.object({}),
  reqBody: z.object({
    username: z.string().min(4),
    gender: z.enum(['male', 'female', 'other']).optional(),
    birthDate: z.date(),
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
export class CreateUserController extends AuthenticatedController<ReqBody, ResBody, ResCode> {
  openApiSpec = openApiSpec
  constructor() {
    super(schema)
  }

  protected async _execute(req: ReqBody, user: User): Promise<{ status: ResCode; body: ResBody }> {
    await db.user.create({
      data: {
        id: user.uid,
        email: user.email || '',
        username: req.username,
        gender: req.gender,
        birthDate: req.birthDate ? new Date(req.birthDate) : null,
        prefectureId: req.prefectureId,
      },
    })

    return {
      status: 201,
      body: {},
    }
  }
}

import { User } from '@mimi-api/common/entities/User'
import { AuthenticatedHandler } from '@mimi-api/handlers/basic/AuthenticatedHandler'
import { ResCodeOf } from '@mimi-api/handlers/types/ResCodeOf'
import { db } from '@mimi-api/libs/database'
import { commonErrorSchema } from '@mimi-api/libs/openapi/CommonErrorSchema'
import { onRequest } from 'firebase-functions/v2/https'
import { z } from 'zod'

const schema = {
  pathParams: z.object({}),
  queryParams: z.object({}),
  reqBody: z.object({
    username: z.string().min(1),
    gender: z.enum(['male', 'female', 'other']).optional(),
    birthDate: z.string().optional(),
    prefectureId: z.number().optional(),
  }),
  resBody: z.object({
    user: z.object({
      id: z.string(),
      username: z.string(),
      email: z.string(),
      gender: z.string().optional(),
      birthDate: z.string().optional(),
    }),
  }),
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

export class CreateUserHandler extends AuthenticatedHandler<ReqBody, ResBody, ResCode> {
  openApiSpec = openApiSpec
  constructor() {
    super(schema)
  }

  protected async handle(req: ReqBody, user: User): Promise<{ status: ResCode; body: ResBody }> {
    const _user = await db.user.create({
      data: {
        id: user.uid,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        email: user.email!,
        username: req.username,
        gender: req.gender,
        birthDate: req.birthDate ? new Date(req.birthDate) : null,
        prefectureId: req.prefectureId,
      },
    })

    return {
      status: 201,
      body: {
        user: {
          id: _user.id,
          username: _user.username,
          email: _user.email,
          gender: _user.gender ?? undefined,
          birthDate: _user.birthDate?.toISOString(),
        },
      },
    }
  }
}

export const createUser = onRequest((req, res) => {
  void new CreateUserHandler().execute(req, res)
})

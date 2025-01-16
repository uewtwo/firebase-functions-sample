import { BaseHandler } from '@mimi-api/handlers/basic/BaseHandler'
import { ResCodeOf } from '@mimi-api/handlers/types/ResCodeOf'
import { commonErrorSchema } from '@mimi-api/libs/openapi/CommonErrorSchema'
import { onRequest } from 'firebase-functions/v2/https'
import { z } from 'zod'

const schema = {
  pathParams: z.object({}),
  queryParams: z.object({}),
  reqBody: z.object({}),
  resBody: z.object({
    message: z.string(),
  }),
}

const openApiSpec = {
  method: 'get',
  path: '/hello',
  description: 'Hello, World!',
  tags: ['System'],
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

export class HelloHandler extends BaseHandler<ReqBody, ResBody, ResCode> {
  openApiSpec = openApiSpec
  constructor() {
    super(schema)
  }

  protected async handle(_req: ReqBody): Promise<{ status: ResCode; body: ResBody }> {
    return {
      status: 200,
      body: {
        message: 'Hello, World!',
      },
    }
  }
}

export const hello = onRequest((req, res) => {
  void new HelloHandler().execute(req, res)
})

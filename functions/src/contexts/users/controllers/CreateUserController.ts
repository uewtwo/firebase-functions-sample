// import { BasicController } from '@mimi-api/contexts/common/controllers/BasicController'
// import { ResCodeOf } from '@mimi-api/contexts/common/controllers/types/ReqRes'
// import { NoAuthRequestContext } from '@mimi-api/contexts/common/requestContext/RequestContext'
// import { UserId } from '@mimi-api/contexts/common/types/id'
// import { ErrorResBody, commonErrorSchema } from '@mimi-api/libs/openapi/CommonErrorSchema'

// import { z } from 'zod'

// const schema = {
//   pathParams: z.object({}),
//   queryParams: z.object({}),
//   reqBody: z.object({
//     username: z.string().min(4),
//     gender: z.enum(['male', 'female', 'other']).optional(),
//     birthDate: z.date(),
//     prefectureId: z.number().optional(),
//   }),
//   resBody: z.object({
//     id: z.number().transform(UserId),
//   }),
// }

// const openApiSpec = {
//   method: 'post',
//   path: '/createUser',
//   description: 'Create new user',
//   tags: ['User'],
//   request: {
//     params: schema.pathParams,
//     query: schema.queryParams,
//     body: {
//       content: {
//         'application/json': {
//           schema: schema.reqBody,
//         },
//       },
//     },
//     headers: undefined,
//   },
//   responses: {
//     201: {
//       description: 'User created successfully',
//       content: {
//         'application/json': {
//           schema: schema.resBody,
//         },
//       },
//     },
//     ...commonErrorSchema,
//   },
// } as const

// type ReqBody = z.infer<typeof schema.reqBody>
// type ResBody = z.infer<typeof schema.resBody>
// type ResCode = ResCodeOf<typeof openApiSpec>

// // WIP
// export class CreateUserController extends BasicController<ReqBody, ResBody, ResCode> {
//   openApiSpec = openApiSpec
//   constructor() {
//     super(schema)
//   }

//   async _execute(
//     req: ReqBody,
//     context: NoAuthRequestContext,
//   ): Promise<{ status: ResCode; body: ResBody | ErrorResBody }> {
//     const authHeader = context.headers.authorization
//     if (!authHeader?.startsWith('Bearer ')) {
//       return {
//         status: 404,
//         body: { error: { message: 'Not found auth header' } },
//       }
//     }
//     const token = authHeader.split('Bearer ')[1]
//     const decodedToken = await this.firebase.auth.verifyIdToken(token)

//     const record = await this.db.users.create({
//       select: { id: true },
//       data: {
//         firebaseUid: decodedToken.user_id,
//         email: decodedToken.email || '',
//         username: req.username,
//         gender: req.gender,
//         birthDate: req.birthDate ? new Date(req.birthDate) : null,
//       },
//     })

//     return {
//       status: 201,
//       body: {
//         id: UserId(record.id),
//       },
//     }
//   }
// }

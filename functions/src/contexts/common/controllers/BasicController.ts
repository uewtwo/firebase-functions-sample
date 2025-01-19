// import { getFirebaseAdmin, initializeFirebase } from '@mimi-api/configs/Firebase'
// import { IBasicHandler } from '@mimi-api/contexts/common/controllers/IBasicController'
// import { ReqResSchema } from '@mimi-api/contexts/common/controllers/types/ReqRes'
// import { User } from '@mimi-api/contexts/common/entities/User'
// import { NoAuthRequestContext } from '@mimi-api/contexts/common/requestContext/RequestContext'
// import { ErrorCodes, ErrorResBody } from '@mimi-api/libs/openapi/CommonErrorSchema'
// import { IOpenApiSpec } from '@mimi-api/libs/openapi/IOpenApiSpec'
// import { handleError } from '@mimi-api/libs/utils/Error'
// import type { Response } from 'express'
// import type { Request } from 'firebase-functions/v2/https'

// export abstract class BasicController<TRequest, TResponse, TResCode extends number> implements IBasicHandler {
//   abstract openApiSpec: IOpenApiSpec
//   protected firebase: ReturnType<typeof getFirebaseAdmin>

//   constructor(private readonly schema: ReqResSchema) {
//     initializeFirebase()
//     this.firebase = getFirebaseAdmin()
//   }

//   protected async executeContainer(
//     req: Request,
//     user?: User,
//   ): Promise<{ status: TResCode | ErrorCodes; body: TResponse | ErrorResBody }> {
//     try {
//       const validatedRequest = this.schema.reqBody.safeParse(req.body)
//       if (!validatedRequest.success) {
//         const error: ErrorResBody = {
//           error: {
//             message: 'Invalid request body',
//             cause: validatedRequest.error.errors,
//           },
//         }

//         return { status: 400, body: error }
//       }

//       const context = { headers: req.headers, user }
//       const result = await this._execute(validatedRequest.data, context)

//       const validatedResponse = this.schema.resBody.safeParse(result.body)
//       if (!validatedResponse.success) {
//         console.error('Response validation error:', validatedResponse.error)
//         const error: ErrorResBody = {
//           error: {
//             message: 'Internal server error',
//             cause: validatedResponse.error.errors,
//           },
//         }

//         return { status: 500, body: error }
//       }

//       return { status: result.status, body: validatedResponse.data }
//     } catch (error) {
//       const errorResponse = handleError(error)
//       return { status: errorResponse.error.code as ErrorCodes, body: errorResponse }
//     }
//   }

//   async execute(req: Request, res: Response): Promise<void> {
//     const { status, body } = await this.executeContainer(req)
//     res.status(status).json(body)
//   }

//   protected abstract _execute(
//     req: TRequest,
//     contexts: NoAuthRequestContext,
//   ): Promise<{ status: TResCode; body: TResponse | ErrorResBody }>
// }

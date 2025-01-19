import { app, startServer } from '@mimi-api/app'
import { Response } from 'express'
import * as functions from 'firebase-functions'
import type { Request } from 'firebase-functions/https'

startServer().catch(error => {
  console.error('Error starting the server:', error)
  process.exit(1)
})

const handler = (req: Request, res: Response) => {
  if (!req.url) {
    req.url = '/'
  }
  return app(req, res)
}

export const api = functions.https.onRequest(handler)

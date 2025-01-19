import { IBasicController } from '@mimi-api/contexts/common/controllers/IBasicController'
import cors from 'cors'
import { onRequest } from 'firebase-functions/v2/https'

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
}

export const requestHandlers = (executors: {
  get?: IBasicController
  post?: IBasicController
  put?: IBasicController
  delete?: IBasicController
}) =>
  onRequest((req, res) => {
    // for preflight request
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Origin', '*')
      res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
      res.set('Access-Control-Max-Age', '3600')
      res.status(204).send('')
      return
    }

    cors(corsOptions)(req, res, () => {
      const makeAllowedMethods = () => {
        const methods = Object.keys(executors).filter(
          method => executors[method as keyof typeof executors] !== undefined,
        )
        return methods.join(', ')
      }
      type ImplementedAllMethods = 'get' | 'post' | 'put' | 'delete'
      const method = req.method.toLowerCase() as ImplementedAllMethods // a little bit dangerous assertion
      switch (method) {
        case 'get': {
          if (executors.get === undefined) {
            res.status(405).set('Allow', makeAllowedMethods()).send('Method Not Allowed')
            return
          }
          executors.get.execute(req, res)
          break
        }
        case 'post': {
          if (executors.post === undefined) {
            res.status(405).set('Allow', makeAllowedMethods()).send('Method Not Allowed')
            return
          }
          executors.post.execute(req, res)
          break
        }
        case 'put': {
          if (executors.put === undefined) {
            res.status(405).set('Allow', makeAllowedMethods()).send('Method Not Allowed')
            return
          }
          executors.put.execute(req, res)
          break
        }
        case 'delete': {
          if (executors.delete === undefined) {
            res.status(405).set('Allow', makeAllowedMethods()).send('Method Not Allowed')
            return
          }
          executors.delete.execute(req, res)
          break
        }
        default: {
          const _exhaustiveCheck: never = method
          throw new Error(`Not implemented methods: ${_exhaustiveCheck}`)
        }
      }
    })
  })

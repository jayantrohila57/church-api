import { NextFunction, Request, Response } from 'express'
import { Responses } from './response'

export const TC = (fn: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fn(req, res)
    return next()
  } catch (error: any) {
    Responses(res, error.message, {}, error)
  }
}

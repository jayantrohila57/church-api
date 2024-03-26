import { Response } from 'express'
import { logger } from '..'

export const Responses = (res: Response, message: string, data?: object, error?: object) => {
  error == null && logger.info(message)
  error != null && logger.error(message)
  return res.send({ message, data: data || {}, error: error || {} })
}

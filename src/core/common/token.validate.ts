import { NextFunction, Request, Response } from 'express'
import { TC } from './tc'
import { verifyToken } from '../../module/auth/token.factory'
import { tokenTypes } from '../constant'
import { db } from '../database/database'
 
// Middleware to validate access tokens
const tokenValidate = TC(async (req: Request, res: Response, next: NextFunction) => {
  // Received token from frontend in the Authorization header
  const verifiedToken = verifyToken(req.headers.authorization as string)

  // Extract userId from the verified token
  if (verifiedToken.type !== tokenTypes.ACCESS) return res.send({ message: 'Invalid token ' })

  // Get user authentication information from the database based on userId
  const getAuth = await db.user.findUnique({
    include: { auth: true },
    where: { id: verifiedToken.userId },
  })

  // Extract the access token from the user's authentication information
  const authToken = getAuth?.auth?.token[0]?.access?.token!

  // Compare the received token and the extracted access token
  if (authToken && req.headers.authorization) {
    if ((req.headers.authorization.split(' ')[1] as string) !== authToken)
      return res.send({ message: 'Invalid token ' })

    // Continue to the next middleware or route handler if the token is valid
    return next()
  }
})

export default tokenValidate
